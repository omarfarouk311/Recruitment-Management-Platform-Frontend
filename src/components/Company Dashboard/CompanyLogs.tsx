import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { Logs } from "../../types/companyDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import useStore from "../../stores/globalStore";

const CompanyLogs = () => {
  const filters = useStore.useCompanyLogsFilters();
  const actionType = useStore.useCompanyLogsActionType();
  const performedBy = useStore.useCompanyLogsPerformedBy();
  const setFilters = useStore.useCompanyLogsSetFilters();
  const setActionType = useStore.useCompanyLogsSetActionType();
  const setPerformedBy = useStore.useCompanyLogsSetPerformedBy();
  const useData = useStore.useCompanyLogsData;
  const useHasMore = useStore.useCompanyLogsHasMore;
  const useIsLoading = useStore.useCompanyLogsIsLoading;
  const useFetchData = useStore.useCompanyLogsFetchData;
  const fetchData = useFetchData();
  const clear= useStore.useCompanyLogsTabClear();

  useEffect(() => {
    clear();
    setActionType();
    setPerformedBy();
    fetchData();
    return clear;
  }, []);

  const columns: ColumnDef<Logs>[] = [
    {
      key: "performedBy",
      header: "Performed By",
    },
    {
      key: "performedAt",
      header: "Performed At",
    },
    {
      key: "actionType",
      header: "Action Type",
    },
    {
      key: "extraData",
      header: "Extra Data",
      render: (row) => (
        <div className="inline-block text-left">
          {Object.entries(row.extraData).map(([key, value]) => (
            <div key={key}>
              {`${key}: `}
              <b>{typeof value === "object" ? JSON.stringify(value) : value}</b>
            </div>
          ))}
        </div>
      ),
      //cellClassName: "max-w-[200px]"
    },
  ];

  return (
    <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="px-6 py-2 text-3xl font-bold">Logs</h1>
        <div className="flex items-center py-4 px-6 space-x-20 flex-nowrap z-20">
          <FilterDropdown
            label="Performed By"
            options={performedBy}
            selectedValue={filters.performedBy}
            onSelect={(value) => setFilters({ performedBy: value })}
          />

          <FilterDropdown
            label="Action type"
            options={actionType}
            selectedValue={filters.action}
            onSelect={(value) => setFilters({ action: value })}
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
export default CompanyLogs;
