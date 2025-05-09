import { useEffect } from "react";

import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import { CompanyJobsRecruitersSortOptions } from '../../types/company';
import Button from "../common/Button";

import { CompanyRecruiters as companyRecruiters } from "../../types/companyDashboard";

const CompanyAssignedCandidates = () => {
       const filters = useStore.useCompanyRecruitersFilters();

        const setFilters = useStore.useCompanyRecruitersSetFilters();

        const resetCompanyRecruiters = useStore.useResetCompanyRecruiters();

        const fetchCompanyRecruiters = useStore.useCompanyRecruitersFetchRecruiters;
        const companyRecruiters = useStore.useCompanyRecruiters;

        const companyDeleteRecruiter = useStore.useCompanyRecruitersDelete();
        const fetchRecruiterNames = useStore.useCompanyRecruitersFetchRecruiters();
        const recruiterNames = useStore.useCompanyRecruiterNames();

        const useIsLoading = useStore.useCompanyRecruitersIsLoading;
        const useHasMore = useStore.useCompanyRecruitersHasMore;

        const setRecruiterId = useStore.useCompanyRecruiterSetId();

    
        useEffect(() => {
            resetCompanyRecruiters();
            fetchRecruiterNames();
        }, []);

        const handleRowClick = (recruiter: companyRecruiters) => {
            setRecruiterId(recruiter.id); // Update the recruiter ID in state
        };

        const columns: ColumnDef<companyRecruiters>[] = [ 
            {
                key: "name",
                header: "Name",
                render: (recruiter) => (
                    <div   className="cursor-pointer text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200"   
                    onClick={() => handleRowClick(recruiter)}
                    >
                        {recruiter.name}
                    </div>
                )    
            },
            {
                key: "department",
                header: "Department",
            },
            {
                key: "assigned_candidates_cnt",
                header: "Assigned Candidates",
            },
            {
                key: "remove",
                header: "Fire Recruiter",
                render: (recruiter) => (
                <div className="flex justify-center w-full"> {/* Centering container */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5 text-amber-600 hover:text-amber-800 cursor-pointer"
                      onClick={() => companyDeleteRecruiter(recruiter.id)}
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="18" y1="8" x2="23" y2="8" />
                    </svg>
                  </div>
                )
              }
        ]
        return (
            <div className="flex flex-col h-full">
            {/* Non-scrollable header */}
            <div className="shrink-0">
            <h1 className="px-6 py-2 text-3xl font-bold">Assigned Candidates</h1>
            
            {/* Filter dropdowns row - now positioned below the title */}
            <div className="flex items-center py-4 px-6 gap-4 flex-nowrap z-10">
            {/* First dropdown */}
            <FilterDropdown
                key="name"
                label="Recruiter"
                options={[
                    ...(recruiterNames && recruiterNames.length > 0
                    ? recruiterNames.map((title) => ({
                        value: String(title),
                        label: String(title)
                        }))
                    : [{
                        value: '',
                        label: 'No recruiters available'
                        }])
                ]}
                selectedValue={filters.name ? String(filters.name) : ''}
                onSelect={(value) => {
                    setFilters({ 
                    ...filters, 
                    name: value || undefined // Set to undefined when neutral is selected
                    });
                }}
                disabled={!recruiterNames || recruiterNames.length === 0}
                />

            {/* Second dropdown - now positioned immediately after the first */}
            <FilterDropdown
                key="assignedCandidates"
                label="Sort by: Assigned Candidates"
                options={[
                    // Add neutral option first
                    ...CompanyJobsRecruitersSortOptions.filter(
                    (option) => option.value === "1" || option.value === "-1"
                    )
                ]}
                selectedValue={filters.assigned_candidates_cnt ? String(filters.assigned_candidates_cnt) : ''}
                onSelect={(value) => {
                    setFilters({ 
                    ...filters, 
                    assigned_candidates_cnt: value ? Number(value) : undefined
                    });
                }}
                />
            </div>
            </div>
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                    <Dashboard
                        columns={columns}
                        useData={companyRecruiters}
                        useHasMore={useHasMore}
                        useIsLoading={useIsLoading}
                        useFetchData={fetchCompanyRecruiters}
                    />
                </div>
            </div>
        );


    
    
}


export default CompanyAssignedCandidates;