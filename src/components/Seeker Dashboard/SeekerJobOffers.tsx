import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { JobOfferOverviewType } from "../../types/jobOffer";
import { useCallback, useEffect, useState } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { DashboardStatusFilterOptions } from "../../types/seekerDashboard";
import { JobOfferSortByFilterOptions } from "../../types/jobOffer";
import Button from "../common/Button";
import JobDetailsDialog from "../common/JobDetailsDialog";
import JobOfferDialog from "../common/JobOfferDialog";
import { JobOfferDecision } from "../../stores/Seeker Dashboard Slices/SeekerJobOffersSlice";

const SeekerJobOffers = () => {
    const filters = useStore.useSeekerJobOffersFilters();
    const setFilters = useStore.useSeekerJobOffersSetFilters();
    const CompanyNames = useStore.useSeekerJobOffersCompanyNames();
    const useSetCompanyNames = useStore.useSeekerJobOffersSetCompanyNames();
    const fetchData = useStore.useSeekerJobOffersFetchData();
    const useSetJobDetailsDialogIsOpen = useStore.useJobDetailsDialogSetIsOpen();
    const useSetSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();
    const useSetSeekerJobOfferDialogIsOpen = useStore.useSeekerJobOfferDialogSetIsOpen();
    const useSeekerJobOfferDialogSetJobIdAndCandidateId = useStore.useSeekerJobOfferDialogSetJobIdAndCandidateId();
    const useMakeDecision = useStore.useSeekerJobOfferMakeDecision();
    const [ useIsMakingDecision, useSetIsMakingDecision ] = useState<null | number>(null);
    const clear = useStore.useClearSeekerJobOffers();

    useEffect(() => {
        clear();
        useSetCompanyNames();
        fetchData();

        return clear;
    }, []);

    const columns: ColumnDef<JobOfferOverviewType>[] = [
        { 
            key: "jobTitle", 
            header: "Job Title",
            render: (row) => {
                return(
                <div>
                    <button onClick={() => {
                        useSetJobDetailsDialogIsOpen(true);
                        useSetSelectedJobId(row.jobId);
                    }}
                    disabled={!row.jobId}
                    className={row.jobId ? "text-blue-600 hover:underline underline-offset-2" : ""}
                    title={row.jobId ? "Click to view job details" : "No job details available"}>
                        {row.jobTitle}
                    </button>

                </div>
            )}
        },
        { 
            key: "companyName", 
            header: "Company",
            render: (row) => {
                return(
                <div>
                    {row.companyId ? (
                        <Link 
                            to={`/seeker/companies/${row.companyId}`}
                            className="px-2 text-blue-600 hover:underline underline-offset-2"
                            title="Click to view company profile">
                            {row.companyName}
                        </Link>
                    ) : (
                        <span className="px-2 cursor-default" title="Company profile not available">
                            {row.companyName}
                        </span>
                    )}
                </div>
            )}
        },
        { key: "country", header: "Location" },
        { key: "dateRecieved", header: "Date Recieved" },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span
                className={
                  row.status === 'Pending' ? 'text-yellow-600' :
                  row.status === 'Accepted' ? 'text-green-600' : 'text-red-600'
                }
              >
                {row.status}
              </span>
            )
        },
        {
            key: "decision",
            header: "Decision",
            render: (row) => row.status === 'Pending'? (
                <div className="flex items-center space-x-4">
                    <Button
                        loading={useIsMakingDecision !== null && useIsMakingDecision === row.jobId}
                        onClick={async () => {
                            useSetIsMakingDecision(row.jobId);
                            await useMakeDecision(row.jobId, JobOfferDecision.Accepted);
                            useSetIsMakingDecision(null);
                        }}
                        className="w-[50%]" >
                            Accept
                    </Button>

                    <Button
                        variant="report"
                        loading={useIsMakingDecision !== null && useIsMakingDecision === row.jobId}
                        onClick={async () => {
                            useSetIsMakingDecision(row.jobId);
                            await useMakeDecision(row.jobId, JobOfferDecision.Rejected);
                            useSetIsMakingDecision(null);
                        }}
                        className="w-[50%]" >
                            Reject
                    </Button>
                </div>
            ) : null
        },
        {
            key: "Offer",
            header: "Offer",
            render: (row) =>
                row.status === 'Pending'? (
                    <button
                        onClick={() => {
                            useSetSeekerJobOfferDialogIsOpen(true);
                            useSeekerJobOfferDialogSetJobIdAndCandidateId(row.jobId);
                        }}
                        className= "w-4">
                        <ExternalLink className="relative" /> 
                    </button>
                ): null
        }
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Jobs Offers</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-10">

                    <LocationSearch
                        selectedCountry={filters.country}
                        onCountryChange={useCallback((value) => setFilters({ country: value, city: "" }), [])}
                        selectedCity={filters.city}
                        onCityChange={useCallback((value) => setFilters({ city: value }), [])}
                    />

                    <FilterDropdown
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ status: value })}
                        addAnyOption={false}
                    />

                    <FilterDropdown
                        label="Company Name"
                        options={CompanyNames}
                        selectedValue={filters.company}
                        onSelect={(value) => setFilters({ company: value })}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={JobOfferSortByFilterOptions}
                        selectedValue={filters.sortBy}
                        onSelect={(value) => setFilters({ sortBy: value })}
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[580px]">
                <Dashboard
                    columns={columns}
                    useData={useStore.useSeekerJobOffersData}
                    useHasMore={useStore.useSeekerJobOffersHasMore}
                    useIsLoading={useStore.useSeekerJobOffersIsLoading}
                    useFetchData={useStore.useSeekerJobOffersFetchData}
                />
                <JobDetailsDialog/>
                <JobOfferDialog
                    useIsOpen={useStore.useSeekerJobOfferDialogIsOpen}
                    useSetIsOpen={useStore.useSeekerJobOfferDialogSetIsOpen()}
                    useSelectedJobIdAndCandidateId={useStore.useSeekerJobOfferDialogJobIdAndCandidateId}
                />
            </div>
        </div>
    );
}

export default SeekerJobOffers;