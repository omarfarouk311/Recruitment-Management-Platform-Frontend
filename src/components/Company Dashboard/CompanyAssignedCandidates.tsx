import { useEffect } from "react";
import { Link } from "react-router-dom";

import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";

import { CompanyAssignedCandidates as companyAssignedCandidates } from "../../types/companyDashboard";

const CompanyAssignedCandidates = () => {
       const filters = useStore.useCompanyAssignedCandidatesFilters();

        const setFilters = useStore.useCompanyAssignedCandidatesSetFilters();

        const resetCompanyAssignedCandidates = useStore.useResetCompanyAssignedCandidates();

        const fetchCompanyAssignedCandidates = useStore.useCompanyAssignedCandidatesFetchCandidates;
        const fetchCompanyAssignedCandidatesData = fetchCompanyAssignedCandidates();
        const CompanyCandidates = useStore.useCompanyAssignedCandidates;

        const fetchJobTitles = useStore.useCompanyAssignedCandidatesFetchJobTitles();
        const jobTitles = useStore.useCompanyAssignedCandidatesJobTitles();

        const fetchPhases = useStore.useCompanyAssignedCandidatesFetchPhases();
        const phases = useStore.useCompanyAssignedCandidatesPhases();

        const useIsLoading = useStore.useCompanyAssignedCandidatesIsLoading;
        const useHasMore = useStore.useCompanyAssignedCandidatesHasMore;

        const recruiterId = useStore.useCompanyRecruiterId();

        const unassignCandidate = useStore.useCompanyAssignedCandidatesUnAssign();

    
        useEffect(() => {
            resetCompanyAssignedCandidates();
            fetchJobTitles();
            fetchPhases();
            if(recruiterId !== null) {
                fetchCompanyAssignedCandidatesData();
            }
        }, [recruiterId]);


        const columns: ColumnDef<companyAssignedCandidates>[] = [ 
            {
                key: "job_seeker_name",
                header: "Job Seeker",
                render: (row) => {
                    return (
                        <Link
                            to={`/seeker/${row.job_seeker_id}/job/${row.job_id}`}
                            className="text-blue-600 hover:underline underline-offset-2"
                            title="Click to view candidate details"
                        >
                            {row.job_seeker_name}
                        </Link>
                    );
                },
            },
            {
                key: "job_title",
                header: "Job Title",
            },
            {
                key: "phase_name",
                header: "Phase",
            },
            {
                key: "remove",
                header: "Unassign Candidate",
                render: (info) => (
                    <div className="flex justify-center w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-5 h-5 text-red-500 hover:text-red-900 cursor-pointer transition-colors"
                            onClick={() => unassignCandidate(info.job_id, info.job_seeker_id)}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                )
            }
        ]
        return (
            recruiterId === null ? (
                <div className="flex flex-col items-center justify-center h-[740px] bg-white rounded-3xl border-2 border-gray-200 p-8">
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
                        No Reccuiter Selected
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Please select a Recruiter from the list to view his candidates
                    </p>
                    <div className="text-sm text-gray-400">
                        Tip: Click on any job in the left panel to get started
                    </div>
                </div>
            </div>
            ) : (
            <div className="flex flex-col h-full">
            {/* Non-scrollable header */}
            <div className="shrink-0">
            <h1 className="px-6 py-2 text-3xl font-bold">Assigned Candidates</h1>
            
            {/* Filter dropdowns row - now positioned below the title */}
            <div className="flex items-center py-4 px-6 gap-4 flex-nowrap z-10">
            {/* First dropdown */}
            <FilterDropdown
                key="Phase"
                label="Phase Type"
                options={phases}
                selectedValue={filters.phaseType}
                onSelect={(value) =>
                    setFilters({ ...filters, phaseType: value })
                }
                disabled={!phases || phases.length === 0}
                />

            {/* Second dropdown - now positioned immediately after the first */}
            <FilterDropdown
                label="Job Title"
                options={jobTitles}
                
                selectedValue={filters.jobTitle}
                onSelect={(value) => setFilters({ ...filters, jobTitle: value })}
                disabled={!jobTitles || jobTitles.length === 0}
            />
            </div>
            </div>
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                    <Dashboard
                        columns={columns}
                        useData={CompanyCandidates}
                        useHasMore={useHasMore}
                        useIsLoading={useIsLoading}
                        useFetchData={fetchCompanyAssignedCandidates}
                    />
                </div>
            </div>
        )
        );



    
    
}


export default CompanyAssignedCandidates;