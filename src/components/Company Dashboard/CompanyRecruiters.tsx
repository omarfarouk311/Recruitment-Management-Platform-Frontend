import { useEffect, useState } from "react";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import { CompanyJobsRecruitersSortOptions } from "../../types/company";
import { CompanyRecruiters as companyRecruiters } from "../../types/companyDashboard";
import { PlusCircle } from "lucide-react";

const CompanyRecruiters = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecruiter, setNewRecruiter] = useState({
        email: "",
        department: "",
        deadline: "",
    });

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
    const addNewRecruiter = useStore.useCompanyRecruitersAdd(); // Make sure this exists in your store

    useEffect(() => {
        resetCompanyRecruiters();
        fetchRecruiterNames();
    }, []);

    const handleRowClick = (recruiter: companyRecruiters) => {
        setRecruiterId(recruiter.id);
    };

    const handleAddRecruiter = () => {
        // Call your API here
        addNewRecruiter(newRecruiter.email, newRecruiter.department, newRecruiter.deadline);

        // Reset form and close modal
        setNewRecruiter({
            email: "",
            department: "",
            deadline: "",
        });
        setShowAddForm(false);
    };

    const columns: ColumnDef<companyRecruiters>[] = [
        {
            key: "name",
            header: "Name",
            render: (recruiter) => (
                <div
                    className="cursor-pointer text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleRowClick(recruiter)}
                >
                    {recruiter.name}
                </div>
            ),
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
                <div className="flex justify-center w-full">
                    {" "}
                    {/* Centering container */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => companyDeleteRecruiter(recruiter.id)}
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="18" y1="8" x2="23" y2="8" />
                    </svg>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col h-full relative">
            {/* Non-scrollable header */}
            <div className="mb-4">
                <div className="flex justify-between items-center px-6 py-2">
                    <h1 className="text-3xl font-bold">Recruiters</h1>
                    <button
                        className="flex items-center text-sm font-semibold text-gray-500 hover:text-black"
                        title="Add a new recruiter"
                        onClick={() => setShowAddForm(true)}
                    >
                        <PlusCircle size={30} />
                    </button>
                </div>

                {/* Filter dropdowns row */}
                <div className="flex items-center py-4 px-6 gap-12 flex-nowrap z-10">
                    <FilterDropdown
                        key="name"
                        label="Recruiter"
                        options={[
                            ...(recruiterNames && recruiterNames.length > 0
                                ? recruiterNames.map((title) => ({
                                      value: String(title),
                                      label: String(title),
                                  }))
                                : [
                                      {
                                          value: "",
                                          label: "No recruiters available",
                                      },
                                  ]),
                        ]}
                        selectedValue={filters.name ? String(filters.name) : ""}
                        onSelect={(value) => {
                            setFilters({
                                ...filters,
                                name: value || undefined,
                            });
                        }}
                        disabled={!recruiterNames || recruiterNames.length === 0}
                    />

                    <FilterDropdown
                        key="assignedCandidates"
                        label="Sort by: Assigned Candidates"
                        options={[
                            ...CompanyJobsRecruitersSortOptions.filter(
                                (option) => option.value === "1" || option.value === "-1"
                            ),
                        ]}
                        selectedValue={filters.sorted ? String(filters.sorted) : ""}
                        onSelect={(value) => {
                            setFilters({
                                ...filters,
                                sorted: value ? Number(value) : undefined,
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

            {/* Add Recruiter Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Recruiter</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRecruiter.email}
                                    onChange={(e) =>
                                        setNewRecruiter({ ...newRecruiter, email: e.target.value })
                                    }
                                    placeholder="recruiter@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRecruiter.department}
                                    onChange={(e) =>
                                        setNewRecruiter({ ...newRecruiter, department: e.target.value })
                                    }
                                    placeholder="Engineering, HR, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRecruiter.deadline}
                                    onChange={(e) =>
                                        setNewRecruiter({ ...newRecruiter, deadline: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRecruiter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={
                                    !newRecruiter.email || !newRecruiter.department || !newRecruiter.deadline
                                }
                            >
                                Add Recruiter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyRecruiters;
