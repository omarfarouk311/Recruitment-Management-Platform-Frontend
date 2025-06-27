import { useEffect } from "react";

import { Link } from "react-router-dom";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import { CompanyCandidates } from "../../types/candidates";
import { DashboardStatusFilterOptions } from "../../types/company";
import { CompanyCandidateSortByFilters } from "../../types/candidates";



const CompanyJobsCandidates = () => {

    const filters = useStore.useCompanyCandidatesFilters();
    const phaseTypes = useStore.useCompanyCandidatesPhases();

    const setFilters = useStore.useCompanyCandidatesSetFilters();
    const resetCompanyCandidates = useStore.useResetCompanyCandidates();
    const setPhaseTypes = useStore.useCompanyCandidatesSetPhases();
    const setJobId = useStore.useCompanyCandidatesSetCurrentJobId();

    const jobId = useStore.useCompanyTabSelectJobId();

    const selectedCandidates = useStore.useSelectedCandidates();
    const setSelectedCandidates = useStore.useSetSelectedCandidates();

    // const setSelectedRecruiters = useStore.useSetSelectedRecruiters();

    const toggleCandidateSelection = (seekerId: number, recruiterId: number | undefined) => {
        setSelectedCandidates(seekerId, recruiterId)
        console.log(seekerId, recruiterId)
     
    };

    useEffect(() => {
        resetCompanyCandidates();
        setPhaseTypes();
        if (jobId) {
            setJobId(jobId);
        }
    }, [jobId]);

    // Action handlers
    const unassignCandidates = useStore.useCompanyCandidateUnAssign();
    const makeDecision = useStore.useCompanyCandidatesMakeDecision();


    const columns: ColumnDef<CompanyCandidates>[] = [
        {
            key: "select",
            header: "",
            render: (row) => (
                <button
                    onClick={() => toggleCandidateSelection(row.seekerId, row.recruiterId)}
                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-sm transition-colors
                ${selectedCandidates.includes(row.seekerId)
                            ? 'bg-gray-800 border-gray-800 text-white'
                            : 'border-gray-400 hover:border-gray-600'}`}
                    aria-label={selectedCandidates.includes(row.seekerId)
                        ? "Deselect candidate"
                        : "Select candidate"}
                >
                    {selectedCandidates.includes(row.seekerId) && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>
            ),
        },
        {
            key: "rank",
            header: "Rank"
        },
        {
            key: "job_seeker_name",
            header: "Candidate Name",
            render: (row) => {
                return (
                    <Link
                        to={`/company/seeker/${row.seekerId}/job/${jobId}`}
                        className="text-blue-600 hover:underline underline-offset-2"
                        title="Click to view candidate details"
                    >
                        {row.seekerName}
                    </Link>
                );
            },
        },
        {
            key: "dateApplied",
            header: "Date Applied",
            render: (row) => {
                const deadline = new Date(row.dateApplied);

                const formattedDate = deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                    </div>
                );
            }
        },
        {
            key: "candidateLocation",
            header: "Candidate Location",
            render: (row) => (
                <span className="text-gray-600">
                    {row.candidateCountry}, {row.candidateCity}
                </span>
            ),
        },
        {
            key: "phase_name",
            header: "Phase",
            render: (row) => {
                return (
                    <>
                        <span className="text-gray-600">{row.phase}</span>
                        <br />
                        {row.phase === 'assessment' && (
                    <>
                        <span className="text-gray-600 font-semibold">
                            Assessment Score: {row.score || '0'}
                        </span>
                    </>
                )}
                    </>
                );
            },
        },
        {
            key: "recruiter_name",
            header: "Recruiter",
            render: (row) => {
                return (
                    <span className="text-gray-600">{row.recruiterName}</span>
                );
            },
        }
    ];

    return (
        jobId == null ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-3xl border-2 border-gray-200 p-8 shadow">
                <div className="text-center max-w-md">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Job Selected
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Please select a job from the list to view its candidates
                    </p>
                    <div className="text-sm text-gray-400">
                        Tip: Click on any job in the left panel to get started
                    </div>
                </div>
            </div>
        ) :
            <div className="h-[400px] bg-white p-4 rounded-3xl border-2 border-gray-200 flex flex-col">
                {/* Fixed header */}
                <div className="flex justify-between items-center mb-4"> {/* Reduced mb-8 to mb-4 */}
                    <h1 className="px-6 py-2 text-3xl font-bold">Candidates</h1>
                    <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    <LocationSearch
                        selectedCountry={filters.candidateCountry}
                        onCountryChange={(value) => setFilters({ candidateCountry: value })}
                        selectedCity={filters.candidateCity}
                        onCityChange={(value) => setFilters({ candidateCity: value })}
                    />

                        <FilterDropdown
                            label="Phase Type"
                            options={phaseTypes}
                            selectedValue={filters.phaseType}
                            onSelect={(value) =>
                                setFilters({ phaseType: value })
                            }
                        />
                        <FilterDropdown
                            key="status_filter"
                            label="Status"
                            options={DashboardStatusFilterOptions}
                            selectedValue={filters.status}
                            onSelect={(value) => setFilters({ ...filters, status: value })}
                            addAnyOption={false}
                        />
                        <FilterDropdown
                            key="date_filter"
                            label="Sort by"
                            options={CompanyCandidateSortByFilters.filter(
                                (option) => option.value === "1" || option.value === "-1"
                            )}
                            selectedValue={filters.sortBy}
                            onSelect={(value) => setFilters({ ...filters, sortBy: value })}
                        />

                    </div>
                </div>
                <div className="overflow-y-auto h-[580px] px-4">
                    <Dashboard
                        columns={columns}
                        useData={useStore.useCompanycandidates}
                        useHasMore={useStore.useCompanyCandidatesHasMore}
                        useIsLoading={useStore.useCompanyCandidatesIsLoading}
                        useFetchData={
                            useStore.useCompanyCandidatesFetchCandidates
                        }
                    />
                </div>
                {(
                    <div className="flex justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <button
                            onClick={() => makeDecision(selectedCandidates, true, jobId)}
                             className="px-7 py-1.5 rounded-full bg-green-600 text-white border-2 border-green-600 hover:bg-white hover:text-green-600 hover:border-green-600 transition-colors duration-200 font-medium"
                        >
                            Next Phase
                        </button>
                        <button
                            onClick={() => makeDecision(selectedCandidates, false, jobId)}
                            className="px-7 py-1.5 rounded-full border-red-600 bg-red-600 bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:border-red-600 transition-colors duration-200 font-medium"
                      >
                            Reject
                        </button>
                        <button
                            onClick={() => unassignCandidates(jobId, selectedCandidates)}
                            className="px-7 py-1.5 rounded-full bg-black text-white hover:bg-white hover:text-black border border-black transition-colors duration-200 text-medium font-medium"                        >
                            Unassign
                        </button>
                    </div>
                )}
            </div>
    );

}

export default CompanyJobsCandidates;


