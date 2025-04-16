import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import {
  Invitations,
  InvitationsStatusFilterOptions,
  InvitationsSortByFilterOptions,
} from "../../types/companyDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import useStore from "../../stores/globalStore";

const CompanyInvitations = () => {
  const filters = useStore.useCompanyInvitationsFilters();
  const setFilters = useStore.useCompanyInvitationsSetFilters();
  const useData = useStore.useCompanyInvitationsData;
  const useHasMore = useStore.useCompanyInvitationsHasMore;
  const useIsLoading = useStore.useCompanyInvitationsIsLoading;
  const useFetchData = useStore.useCompanyInvitationsFetchData;
  const fetchData = useFetchData();

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<Invitations>[] = [
    {
      key: "department",
      header: "Department",
    },
    {
      key: "recruiter",
      header: "Recruiter",
    },
    {
      key: "dateSent",
      header: "Date Sent",
    },
    {
      key: "deadline",
      header: "Deadline",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={
            row.status === "Pending"
              ? "text-yellow-600"
              : row.status === "Accepted"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="px-6 py-2 text-3xl font-bold">Jobs Applied For</h1>
        <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
            <FilterDropdown
                label="Status"
                options={InvitationsStatusFilterOptions}
                selectedValue={filters.status}
                onSelect={(value) => setFilters({ status: value })}
            />

            <FilterDropdown
                label="Sort By"
                options={InvitationsSortByFilterOptions}
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
};
export default CompanyInvitations;