import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import JobDetailsDialog from "../common/JobDetailsDialog";
import { JobOfferSortByFilterOptions, RecruiterJobOfferInfo } from "../../types/jobOffer";
import JobOfferDialog from "../common/JobOfferDialog";
import { Pencil } from "lucide-react";
import { DashboardStatusFilterOptions } from "../../types/recruiterDashboard";

const RecruiterJobOffer = () => {
    // State hooks
    const filters = useStore.useRecruiterJobOfferFilters();
    const positionTitles = useStore.useRecruiterJobOfferPositionTitles();

    const useSetJobDetailsDialogIsOpen =useStore.useJobDetailsDialogSetIsOpen();
    const useSetSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();
    const useSetSeekerJobOfferDialogIsOpen =useStore.useSeekerJobOfferDialogSetIsOpen();
    const useSeekerJobOfferDialogSetJobIdAndCandidateId =useStore.useSeekerJobOfferDialogSetJobIdAndCandidateId();
    const ResetRecruiterJobOffer = useStore.useResetRecruiterJobOffer();

    // Action hooks
    const setFilters = useStore.useRecruiterJobOfferSetFilters();
    const fetchCandidates = useStore.useRecruiterJobOfferFetchCandidates();
    const setPositionTitles = useStore.useRecruiterJobOfferSetPositionTitles();

    useEffect(() => {
        ResetRecruiterJobOffer();
        setPositionTitles();
        fetchCandidates();
    }, []);

    const columns: ColumnDef<RecruiterJobOfferInfo>[] = [
        {
            key: "seekerName",
            header: "Candidate Name",
            render: (row) => {
                return (
                    <Link
                        to={`/recruiter/seekers/${row.seekerId}/job/${row.jobId}`}
                        className="text-blue-600 hover:underline underline-offset-2"
                        title="Click to view candidate details"
                    >
                        
                        {row.seekerName}
                    </Link>
                );
            },
        },
        {
            key: "jobTitle",
            header: "Job Title",
            render: (row) => {
                return (
                    <div>
                        <button
                            onClick={() => {
                                useSetJobDetailsDialogIsOpen(true);
                                useSetSelectedJobId(row.jobId);
                            }}
                            disabled={!row.jobId}
                            className={
                                row.jobId
                                    ? "text-blue-600 hover:underline underline-offset-2"
                                    : ""
                            }
                            title={
                                row.jobId
                                    ? "Click to view job details"
                                    : "No job details available"
                            }
                        >
                            {row.jobTitle}
                        </button>
                    </div>
                );
            },
        },
        {
            key: "dateApplied",
            header: "Date sent",
            render: (row) => {
                const deadline = new Date(row.dateApplied);

                const formattedDate = deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
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
            header: "status",
            render:(row)=>(
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
            key: "edit",
            header: "Edit",
            render: (row) => (
                row.status === 'Pending' ? (
                    <button
                        onClick={() => {
                            useSetSeekerJobOfferDialogIsOpen(true);
                            useSeekerJobOfferDialogSetJobIdAndCandidateId(
                                row.jobId,
                                row.seekerId
                            );
                        }}
                    >
                        <Pencil />
                    </button>
                ) : null
            ),
        },
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Job Offer Sent</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    <FilterDropdown
                        label="Position"
                        options={positionTitles}
                        selectedValue={filters.jobTitle}
                        onSelect={(value) => setFilters({ jobTitle: value })}
                    />
                    
                    {/* <FilterDropdown
                        key="status_filter"
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ status: value })}
                    /> */}

                        <FilterDropdown
                        label="Sort By"
                        options={JobOfferSortByFilterOptions}
                        selectedValue={filters.sorted}
                        onSelect={(value) =>
                            setFilters({
                                sorted: value as typeof filters.sorted,
                            })
                        }
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[580px] px-4">
                <Dashboard
                    columns={columns}
                    useData={useStore.useRecruiterJobOfferCandidates}
                    useHasMore={useStore.useRecruiterJobOfferHasMore}
                    useIsLoading={useStore.useRecruiterJobOfferIsLoading}
                    useFetchData={useStore.useRecruiterJobOfferFetchCandidates}
                />

                <JobDetailsDialog/>

                <JobOfferDialog
                    useIsOpen={useStore.useSeekerJobOfferDialogIsOpen}
                    useSetIsOpen={useStore.useSeekerJobOfferDialogSetIsOpen()}
                    useSelectedJobIdAndCandidateId={
                        useStore.useSeekerJobOfferDialogJobIdAndCandidateId
                    }
                    isEditing={true}
                />
            </div>
        </div>
    );
};

export default RecruiterJobOffer;
