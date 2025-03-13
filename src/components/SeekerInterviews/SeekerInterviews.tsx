import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { interview, DashboardSortByFilterOptions, DashboardStatusFilterOptions } from "../../types/seekerDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import useStore from "../../stores/globalStore";
import JobDetailsDialog from "../common/JobDetailsDialog";
import { Link } from "react-router-dom";


const SeekerInterviews = () => {
    const filters = useStore.useSeekerInterviewsFilters(); // Update to use interviews filters
    const setFilters = useStore.useSeekerInterviewsSetFilters(); // Update to use interviews filters
    const useData = useStore.useSeekerInterviewsData; // Update to use interviews data
    const useHasMore = useStore.useSeekerInterviewsHasMore; // Update to use interviews hasMore
    const useIsLoading = useStore.useSeekerInterviewsIsLoading; // Update to use interviews isLoading
    const useFetchData = useStore.useSeekerInterviewsFetchData; // Update to use interviews fetchData
    const CompanyNames = useStore.useSeekerInterviewsCompanyNames(); // Update to use interviews company names
    const useSetCompanyNames = useStore.useSeekerInterviewsSetCompanyNames(); // Update to use interviews setCompanyNames
    const fetchData = useFetchData();
    const setDialogIsOpen = useStore.useJobDetailsDialogSetIsOpen();
    const setSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();

    useEffect(() => {
        useSetCompanyNames();
        fetchData();
    }, [useSetCompanyNames, fetchData]);

    const columns: ColumnDef<interview>[] = [
        { 
            key: "jobTitle", 
            header: "Job Title",
            render: (row) => {
                return(
                <div>
                    <button onClick={() => {
                        setDialogIsOpen(true);
                        setSelectedJobId(row.jobId);
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
        { key: "country", header: "Locations" }, // Updated header to "Locations"
        { key: "date", header: "Date" }, // Updated header to "Date"
        { key: "recruiter", header: "recruiter" }, // Updated header to "Date"

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
                <h1 className="px-6 py-2 text-3xl font-bold">Interviews</h1> {/* Updated title */}
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    {/* Removed the Remote filter button */}

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
                    useSetIsOpen={useStore.useJobDetailsDialogSetIsOpen}
                    useSelectedJobId={useStore.useJobDetailsDialogSelectedJobId}
                />
            </div>
        </div>
    );
}

export default SeekerInterviews;