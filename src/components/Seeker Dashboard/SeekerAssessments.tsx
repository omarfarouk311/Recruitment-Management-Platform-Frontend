import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import {
    assessment,
    DashboardSortByFilterOptions,
    DashboardStatusFilterOptions,
} from "../../types/seekerDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import AssessmentDialog from "../common/assessmentDialog";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";

const SeekerAssessment = () => {
    const filters = useStore.useSeekerAssessmentsFilters();
    const setFilters = useStore.useSeekerAssessmentsSetFilters();
    const useData = useStore.useSeekerAssessmentsData;
    const useHasMore = useStore.useSeekerAssessmentsHasMore;
    const useIsLoading = useStore.useSeekerAssessmentsIsLoading;
    const useFetchData = useStore.useSeekerAssessmentsFetchData;
    const CompanyNames = useStore.useSeekerAssessmentsCompanyNames();
    const useSetCompanyNames = useStore.useSeekerAssessmentsSetCompanyNames();
    const fetchData = useFetchData();
    const useSetDialogIsOpen = useStore.useJobDetailsDialogSetIsOpen();
    const useSetSelectedJobId = useStore.useJobDetailsDialogSetSelectedJobId();
    const useSetSelectAssessmentId = useStore.useSetSelectedAssessmentId();
    const useSetAssessmentDialogIsOpen = useStore.useSetAssessmentDialogIsOpen();
    const clear = useStore.useClearSeekerAssessment();

    useEffect(() => {
        clear();
        useSetCompanyNames();
        fetchData();

        return clear;
    }, []);

    const handleEnterAssessment = (assessmentId: number) => {
        useSetSelectAssessmentId(assessmentId);
        useSetAssessmentDialogIsOpen(true);
    };

    const columns: ColumnDef<assessment>[] = [
        {
            key: "jobTitle",
            header: "Job Title",
            render: (row) => {
                return (
                    <div>
                        <button
                            onClick={() => {
                                useSetDialogIsOpen(true);
                                useSetSelectedJobId(row.jobId);
                            }}
                            disabled={!row.jobId}
                            className={row.jobId ? "text-blue-600 hover:underline underline-offset-2" : ""}
                            title={row.jobId ? "Click to view job details" : "No job details available"}
                        >
                            {row.jobTitle}
                        </button>
                    </div>
                );
            },
        },
        {
            key: "companyName",
            header: "Company",
            render: (row) => {
                return (
                    <div>
                        {row.companyId ? (
                            <Link
                                to="/seeker/company-profile"
                                className="px-2 text-blue-600 hover:underline underline-offset-2"
                                title="Click to view company profile"
                            >
                                {row.companyName}
                            </Link>
                        ) : (
                            <span className="px-2 cursor-default" title="Company profile not available">
                                {row.companyName}
                            </span>
                        )}
                    </div>
                );
            },
        },
        { key: "country", header: "Location" },
        { key: "dateAdded", header: "Date Applied" },
        {
            key: "deadline",
            header: "Deadline",
            render: (row) => {
                const date = new Date(row.deadline);
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                const formattedTime = date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                        <span className="text-md text-gray-500">{formattedTime}</span>
                    </div>
                );
            },
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
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="flex justify-center">
                    <Button className="!w-[70%]" onClick={() => handleEnterAssessment(row.assessmentId)}>
                        Enter Assessment
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Assessments</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">
                    <LocationSearch
                        selectedCountry={filters.country}
                        onCountryChange={(value) => setFilters({ country: value, city: "" })}
                        selectedCity={filters.city}
                        onCityChange={(value) => setFilters({ city: value })}
                    />

                    <FilterDropdown
                        label="Status"
                        options={DashboardStatusFilterOptions}
                        addAnyOption={false}
                        selectedValue={filters.status}
                        onSelect={(value) => setFilters({ status: value })}
                    />

                    <FilterDropdown
                        label="Company Name"
                        options={CompanyNames}
                        selectedValue={filters.company}
                        onSelect={(value) => setFilters({ company: value })}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={DashboardSortByFilterOptions}
                        selectedValue={filters.sortBy}
                        onSelect={(value) => setFilters({ sortBy: value })}
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

                <AssessmentDialog />
            </div>
        </div>
    );
};

export default SeekerAssessment;
