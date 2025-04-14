import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import { CandidateSortOptions, Candidate } from "../../types/candidates";
import JobDetailsDialog from "../common/JobDetailsDialog";

const RecruiterCandidates = () => {
    // State hooks
    const filters = useStore.useRecruiterCandidatesFilters();
    const positionTitles = useStore.useRecruiterCandidatesPositionTitles();
    const useMakeDecision = useStore.useRecruiterCandidatesMakeDecision();
    const [useIsMakingDecision, useSetIsMakingDecision] = useState<
        null | number
    >(null);
    const useSetJobDetailsDialogIsOpen =
        useStore.useJobDetailsDialogSetIsOpen();
    const useSetSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();

    // Action hooks
    const setFilters = useStore.useRecruiterCandidatesSetFilters();
    const fetchCandidates = useStore.useRecruiterCandidatesFetchCandidates();
    const setPositionTitles =
        useStore.useRecruiterCandidatesSetPositionTitles();

    useEffect(() => {
        setPositionTitles();
        fetchCandidates();
    }, []);

    const columns: ColumnDef<Candidate>[] = [
        {
            key: "seekerName",
            header: "Candidate Name",
            render: (row) => {
                return (
                    <Link
                        to={`/recruiter/candidates/${row.seekerId}`}
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
            header: "Date Applied",
        },
        {
            key: "phase",
            header: "Phase",
        },
        {
            key: "jobLocation",
            header: "Job Location",
            render: (row) => (
                <span className="text-gray-600">
                    {row.jobCountry},{row.jobCity}
                </span>
            ),
        },
        {
            key: "candidateLocation",
            header: "Candidate Location",
            render: (row) => (
                <span className="text-gray-600">
                    {row.candidateCountry},{row.candidateCity}
                </span>
            ),
        },
        {
            key: "decision",
            header: "Decision",
            render: (row) => (
                <div className="flex items-center space-x-4">
                    <Button
                        loading={
                            useIsMakingDecision !== null &&
                            useIsMakingDecision === row.jobId
                        }
                        onClick={async () => {
                            useSetIsMakingDecision(row.jobId);
                            await useMakeDecision(
                                row.seekerId,
                                true,
                                row.jobId
                            );
                            useSetIsMakingDecision(null);
                        }}
                        className="w-[50%]"
                    >
                        Next Phase
                    </Button>

                    <Button
                        variant="report"
                        loading={
                            useIsMakingDecision !== null &&
                            useIsMakingDecision === row.jobId
                        }
                        onClick={async () => {
                            useSetIsMakingDecision(row.jobId);
                            await useMakeDecision(
                                row.seekerId,
                                false,
                                row.jobId
                            );
                            useSetIsMakingDecision(null);
                        }}
                        className="w-[50%]"
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Candidates</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    <LocationSearch
                        selectedCountry={filters.candidateCountry}
                        selectedCity={filters.candidateCity}
                        onCountryChange={(value) =>
                            setFilters({ candidateCountry: value })
                        }
                        onCityChange={(value) =>
                            setFilters({ candidateCity: value })
                        }
                    />

                    <FilterDropdown
                        label="Position"
                        options={positionTitles}
                        selectedValue={filters.jobTitle}
                        onSelect={(value) => setFilters({ jobTitle: value })}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={CandidateSortOptions}
                        selectedValue={filters.sortBy}
                        onSelect={(value) =>
                            setFilters({
                                sortBy: value as typeof filters.sortBy,
                            })
                        }
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[580px] px-4">
                <Dashboard
                    columns={columns}
                    useData={useStore.useRecruitercandidates}
                    useHasMore={useStore.useRecruiterCandidatesHasMore}
                    useIsLoading={useStore.useRecruiterCandidatesIsLoading}
                    useFetchData={
                        useStore.useRecruiterCandidatesFetchCandidates
                    }
                />

                <JobDetailsDialog
                    useIsOpen={useStore.useJobDetailsDialogIsOpen}
                    useSetIsOpen={useStore.useJobDetailsDialogSetIsOpen()}
                />
            </div>
        </div>
    );
};

export default RecruiterCandidates;
