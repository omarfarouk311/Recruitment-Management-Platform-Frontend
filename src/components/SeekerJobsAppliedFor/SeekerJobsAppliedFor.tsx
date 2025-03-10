import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { JobsAppliedFor, DashboardSortByFilterOptions, DashboardStatusFilterOptions } from "../../types/seekerDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";

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
    useEffect(() => {
        useSetCompanyNames();
        fetchData();
    }, []);

    const columns: ColumnDef<JobsAppliedFor>[] = [
        { key: "jobTitle", header: "Job Title" },
        { key: "companyName", header: "Company" },
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
            </div>
        </div>
    );
}

export default SeekerJobsAppliedFor;