import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { Invitations } from "../../types/recruiterDashboard";
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
    const clear = useStore.useRecruiterInvitationsClear();

    // Fetch data when component mounts and when filters change
    useEffect(() => {
        fetchData();
        return clear;
    }, []);


    const handleDecision = async (rowId: number, decision: number) => {
            useSetIsMakingDecision(rowId);
            await useMakeDecision(rowId, decision);
            useSetIsMakingDecision(null);
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
                            to={`/recruiter/companies/${row.companyId}`}
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
        { 
            key: "dateReceived", 
            header: "Date Received",
            render: (row) => {
                const deadline = new Date(row.dateReceived);

                const formattedDate = deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                const formattedTime = deadline.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                        <span className="text-xs text-gray-500">
                            {formattedTime}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "deadline",
            header: "Deadline",
            render: (row) => {
                const deadline = new Date(row.deadline);

                const formattedDate = deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                const formattedTime = deadline.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                        <span className="text-xs text-gray-500">
                            {formattedTime}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <span
                    className={
                        new Date(row.deadline) >= new Date() && row.status === "Pending"
                            ? "text-yellow-600"
                            : row.status === "Accepted"
                                ? "text-green-600"
                                : "text-red-600"
                    }
                >
                    {new Date(row.deadline) < new Date() && row.status === "Pending" ? "Expired": row.status}
                </span>
            ),
        },
        {
            key: "decision",
            header: "Decision",
            render: (row) =>
                row.status === "Pending" && new Date(row.deadline) >= new Date() ? (
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => handleDecision(row.id, 1)}
                            className="w-[50%]"
                            disabled={useIsMakingDecision === row.id}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="report"
                            onClick={() => handleDecision(row.id, 0)}
                            className="w-[50%]"
                            disabled={useIsMakingDecision === row.id}
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
                        key="status_filter"
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ status: value })}
                    />

                    <FilterDropdown
                        key="date_filter"
                        label="Sort by Date Received"
                        options={DashboardSortByFilterOptions.filter(
                            (option) => option.value === "1" || option.value === "-1"
                        )}
                        selectedValue={filters.sortByDateReceived}
                        onSelect={(value) => setFilters({ ...filters, sortByDateReceived: value })}
                    />

                    <FilterDropdown
                        key="deadline_filter"
                        label="Sort by Deadline"
                        options={DashboardSortByFilterOptions.filter(
                            (option) => option.value === "2" || option.value === "-2"
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