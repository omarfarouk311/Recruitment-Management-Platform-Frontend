import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { JobsAppliedFor, DashboardSortByFilterOptions, DashboardStatusFilterOptions } from "../../types/seekerDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import JobDetailsDialog from "../common/JobDetailsDialog";
import { Link } from "react-router-dom";

const SeekerJobsAppliedFor = () => {
    const filters = useStore.useSeekerJobsAppliedForFilters();
    const setFilters = useStore.useSeekerJobsAppliedForSetFilters();
    const useData = useStore.useSeekerJobsAppliedForData;
    const useHasMore = useStore.useSeekerJobsAppliedForHasMore;
    const useIsLoading = useStore.useSeekerJobsAppliedForIsLoading;
    const useFetchData = useStore.useSeekerJobsAppliedForFetchData;
    const CompanyNames = useStore.useSeekerJobsAppliedForCompanyNames();
    const useSetCompanyNames = useStore.useSeekerJobsAppliedForSetCompanyNames();
    const fetchData = useFetchData();
    const useSetDialogIsOpen = useStore.useJobDetailsDialogSetIsOpen();
    const useSetSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();

    useEffect(() => {
        useSetCompanyNames();
        fetchData();
    }, []);

    const columns: ColumnDef<JobsAppliedFor>[] = [
        { 
            key: "jobTitle", 
            header: "Job Title",
            render: (row) => {
                return(
                <div>
                    <button onClick={() => {
                        useSetDialogIsOpen(true);
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
                            to="/seeker/company-profile" 
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
        { key: "dateApplied", header: "Date Applied" },
        { key: "lastStatusUpdate", header: "Last Updated" },
        { key: "phase", header: "Phase" },
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
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Jobs Applied For</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    <Button
                        variant={filters.remote ? "currentTab" : "outline"}
                        className="h-7 text-sm !w-auto"
                        onClick={() => setFilters({ remote: !filters.remote })}
                    >
                        Remote
                    </Button>

                    <LocationSearch
                        selectedCountry={filters.country}
                        onCountryChange={(value) => setFilters({ country: value, city: "" })}
                        selectedCity={filters.city}
                        onCityChange={(value) => setFilters({ city: value })}
                    />

                    <FilterDropdown
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ status: value })}
                    />

                    <FilterDropdown
                        label="Company Name"
                        options={CompanyNames}
                        selectedValue={filters.company}
                        onSelect={(value) => setFilters({ company: value })}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={DashboardSortByFilterOptions}
                        selectedValue={filters.sortBy}
                        onSelect={(value) => setFilters({ sortBy: value })}
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[580px]">
                <Dashboard
                    columns={columns}
                    useData={useData}
                    useHasMore={useHasMore}
                    useIsLoading={useIsLoading}
                    useFetchData={useFetchData}
                />
                <JobDetailsDialog 
                    useIsOpen={useStore.useJobDetailsDialogIsOpen}
                    useSetIsOpen={useStore.useJobDetailsDialogSetIsOpen()}
                    useSelectedJobId={useStore.useJobDetailsDialogSelectedJobId}
                />
            </div>
        </div>
    );
}

export default SeekerJobsAppliedFor;