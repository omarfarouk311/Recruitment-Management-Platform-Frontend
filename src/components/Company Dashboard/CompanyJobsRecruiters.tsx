import { useEffect } from "react";
import useStore from "../../stores/globalStore";
import { CompanyJobsRecruiters as recruiterColumns, CompanyJobsRecruitersSortOptions } from '../../types/company';
import { ColumnDef } from "../common/Dashboard";
import Button from "../common/Button";
import FilterDropdown from "../Filters/FilterDropdown";
import Dashboard from "../common/Dashboard";




const CompanyJobsRecruiters = () => {
    const filters = useStore.useCompanyJobsRecruitersFilters();
    const setFilters = useStore.useCompanyJobsRecruitersSetFilters();
    const fetchRecruiterNames = useStore.useCompanyJobsRecruitersFetchRecruitersNames();
    const recruiterNames = useStore.useCompanyRecruiterNames()

    const fetchDepartments = useStore.useCompanyJobsRecruitersFetchDepartments()
    const departments = useStore.useCompanyJobsRecruitersDepartments()

    const fetchRecruiters = useStore.useCompanyJobsRecruitersFetchRecruiters;
    const fetchRecruitersData = fetchRecruiters();
    const useData = useStore.useCompanyJobsRecruiters;

    const useIsLoading = useStore.useCompanyJobsRecruitersIsLoading;
    const clear = useStore.useCompanyJobsRecruitersClear();
    const useSelectedJobId = useStore.useCompanyTabSelectJobId();
    const assignCandidatestoRecruiter = useStore.useCompanyJobsRecruitersAssign();
    const selectedCandidates = useStore.useSelectedCandidates();

    const useHasMore = useStore.useCompanyJobsRecruitersHasMore;

    useEffect(() => {
        clear();
        console.log("in company jobs recruiters");

        fetchRecruiterNames();
        fetchDepartments();
        fetchRecruitersData();
    }, []);


    const columns: ColumnDef<recruiterColumns>[] = [
        {
            key: "name",
            header: "Recruiter"
        },
        {
            key: "department",
            header: "Department"
        },
        {
            key: "assigned_candidates_cnt",
            header: "Assigned Candidates"
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => {
                            assignCandidatestoRecruiter(row.id, row.name, useSelectedJobId, selectedCandidates);
                        }}
                    >
                        Assign
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[350px] bg-white p-4 rounded-3xl border-2 border-gray-200 flex flex-col">
            {/* Non-scrollable header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h1 className="px-6 py-2 text-3xl font-bold">Recruiters</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-10">
                    <FilterDropdown
                        key="recruiterName"
                        label="Recruiter"
                        options={
                            recruiterNames && recruiterNames.length > 0
                                ? recruiterNames.map((title) => ({
                                    value: String(title),
                                    label: String(title) // Ensure label is always a string
                                }))
                                : [{
                                    value: '',
                                    label: 'No recruiter available'
                                }]
                        }
                        selectedValue={filters.recruiterName}
                        onSelect={(value) => setFilters({ ...filters, recruiterName: value })}
                        disabled={!recruiterNames || recruiterNames.length === 0}
                    />

                    <FilterDropdown
                        key="department"
                        label="Department"
                        options={departments && departments.length > 0
                            ? departments.map((title) => ({ value: String(title), label: String(title) }))
                            : [{ value: '', label: 'No departments available' }]
                        }
                        selectedValue={filters.department}
                        onSelect={(value) => setFilters({ ...filters, department: value })}
                        disabled={!departments || departments.length === 0}
                    />

                    <FilterDropdown
                        key="assignedCandidates"
                        label="Sort by: Assigned Candidates"
                        options={CompanyJobsRecruitersSortOptions.filter(
                            (option) => option.value === "1" || option.value === "-1"
                        )}
                        selectedValue={String(filters.assignedCandidates)}
                        onSelect={(value) => setFilters({ ...filters, assignedCandidates: (value) })}
                    /> 
                </div>
            </div>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
                <Dashboard
                    columns={columns}
                    useData={useData}
                    useHasMore={useHasMore}
                    useIsLoading={useIsLoading}
                    useFetchData={fetchRecruiters}
                />
            </div>
        </div>
    );


}


export default CompanyJobsRecruiters;