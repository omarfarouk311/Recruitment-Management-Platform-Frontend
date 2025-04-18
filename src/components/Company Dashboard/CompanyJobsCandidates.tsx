import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import { CompanyCandidates } from "../../types/candidates";
import { DashboardStatusFilterOptions } from "../../types/recruiterDashboard";
import { CompanyCandidateSortByFilters } from "../../types/candidates";


const CompanyJobsCandidates = () => {

    const filters = useStore.useCompanyCandidatesFilters();
    const phaseTypes = useStore.useCompanyCandidatesPhases();

    const setFilters = useStore.useCompanyCandidatesSetFilters();
    const resetCompanyCandidates = useStore.useResetCompanyCandidates();
    const setPhaseTypes = useStore.useCompanyCandidatesSetPhases();
    const setJobId = useStore.useCompanyCandidatesSetCurrentJobId();

    const jobId = useStore.useCompanyTabSelectJobId();


    useEffect(() => {
        resetCompanyCandidates();
        setPhaseTypes();
        if (jobId) {
            setJobId(jobId);
        }
    }, [jobId]);


    const columns: ColumnDef<CompanyCandidates>[] = [
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
            key: "dateApplied",
            header: "Date Applied",
            render: (row) => {
                const deadline = new Date(row.dateApplied);

                const formattedDate = deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'GMT'
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                    </div>
                );
            }
        },
        {
            key: "candidateCountry",
            header: "Candidate Location"
        },
        {
            key: "phase_name",
            header: "Phase",
            render: (row) => {
                return (
                    <span className="text-gray-600">{row.phase || ""}</span>
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
            <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-3xl border-2 border-gray-200 p-8">
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
            <div className="h-[500px] bg-white p-4 rounded-3xl border-2 border-gray-200">
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
                    />
                    <FilterDropdown
                        key="date_filter"
                        label="Sort by: Recommendation"
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
        </div>
    );

}

export default CompanyJobsCandidates;
