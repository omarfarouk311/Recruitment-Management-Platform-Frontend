import { useEffect, useState } from "react";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { Invitations, DashboardFilters } from "../../types/recruiterDashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";
import { DashboardStatusFilterOptions, DashboardSortByFilterOptions } from "../../types/recruiterDashboard";

const RecruiterInvitations = () => {
    const filters = useStore.useRecruiterInvitationsFilters();
    const setFilters = useStore.useRecruiterInvitationsSetFilters();
    const useData = useStore.useRecruiterInvitationsData;
    const useHasMore = useStore.useRecruiterInvitationsHasMore;
    const useIsLoading = useStore.useRecruiterInvitationsIsLoading;
    const useFetchData = useStore.useRecruiterInvitationsFetchData;
    const useMakeDecision = useStore.useRecruiterInvitationsMakeDecision();
    const [useIsMakingDecision, useSetIsMakingDecision] = useState<null | number>(null);
    const fetchData = useFetchData();

    useEffect(() => {
        fetchData();
    }, []);

    
    // Format deadline to remove .00Z
    const formatDeadline = (deadline: string) => {
        if (!deadline) return "---";

        // Parse the deadline string into a Date object
        const date = new Date(deadline);

        // Extract date and time components
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");

        // Format as "YYYY-MM-DD HH:MM:SS"
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const columns: ColumnDef<Invitations>[] = [
        {
            key: "department",
            header: "Department",
            render: (row) => <span>{row.department}</span>,
        },
        {
            key: "company",
            header: "Company",
            render: (row) => (
                <div>
                    {row.companyId ? (
                        <Link
                            to={`/company/${row.companyId}`}
                            className="text-blue-600 hover:underline underline-offset-2"
                            title="View company profile"
                        >
                            {row.companyName}
                        </Link>
                    ) : (
                        <span className="cursor-default" title="Company profile not available">
                            {row.companyName}
                        </span>
                    )}
                </div>
            ),
        },
        { key: "dateReceived", header: "Date Received" },
        {
            key: "deadline",
            header: "Deadline",
            render: (row) => <span>{formatDeadline(row.deadline)}</span>,
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
        {
            key: "decision",
            header: "Decision",
            render: (row) =>
                row.status === "Pending" ? (
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={async () => {
                                useSetIsMakingDecision(row.companyId);
                                await useMakeDecision(row.companyId, 1); // Accept
                                useSetIsMakingDecision(null);
                            }}
                            className="w-[50%]"
                        >
                            Accept
                        </Button>
                        <Button
                            variant="report"
                            onClick={async () => {
                                useSetIsMakingDecision(row.companyId);
                                await useMakeDecision(row.companyId, 0); // Reject
                                useSetIsMakingDecision(null);
                            }}
                            className="w-[50%]"
                        >
                            Reject
                        </Button>
                    </div>
                ) : null,
        },
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Invitations</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-10">
                    <FilterDropdown
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ ...filters, status: value })}
                    />

                    <FilterDropdown
                        label="Sort by Date Received"
                        options={DashboardSortByFilterOptions.filter(
                            (option) => option.value === "" || option.value === "1" || option.value === "-1"
                        )}
                        selectedValue={filters.sortByDateReceived}
                        onSelect={(value) => setFilters({ ...filters, sortByDateReceived: value })}
                    />

                    <FilterDropdown
                        label="Sort by Deadline"
                        options={DashboardSortByFilterOptions.filter(
                            (option) => option.value === "" || option.value === "2" || option.value === "-2"
                        )}
                        selectedValue={filters.sortByDeadline}
                        onSelect={(value) => setFilters({ ...filters, sortByDeadline: value })}
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

export default RecruiterInvitations;