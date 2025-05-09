import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { assessment, InvitationsStatusFilterOptions,AssessmentFilters } from "../../types/companyDashboard";
import { useEffect } from "react";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch"
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";


const CompanyAssessment = () => {
    const filters = useStore.useCompanyAssessmentsFilters()
    const setFilters = useStore.useCompanyAssessmentsSetFilters();
    const useData = useStore.useCompanyAssessmentsData
    const useHasMore = useStore.useCompanyAssessmentsHasMore
    const useIsLoading = useStore.useCompanyAssessmentsIsLoading
    const useFetchData = useStore.useCompanyAssessmentsFetchData
    const JobTitles = useStore.useCompanyAssessmentsJobTitleNames();
    const fetchData = useFetchData();
    const useSetJobTitleNames = useStore.useCompanyAssessmentsSetJobTitlesNames();
    const useSetSelectAssessmentId= useStore.useSetSelectedAssessmentId();
    const useSetAssessmentDialogIsOpen=useStore.useSetAssessmentDialogIsOpen();
    const clear = useStore.useClearCompanyAssessment();

    useEffect(() => {
         clear();
         useSetJobTitleNames();
         fetchData();

        return clear;
    }, []);

    const handleEditAssessment = (assessmentId:number) => {
        
        useSetSelectAssessmentId(assessmentId);
        useSetAssessmentDialogIsOpen(true);
   };
   const handleDeleteAssessment = (assessmentId:number) => {
        
    useSetSelectAssessmentId(assessmentId);
    useSetAssessmentDialogIsOpen(true);
};

   const columns: ColumnDef<assessment>[] = [
    { 
        key: "assessmentName", 
        header: "Assessment",
        render: (row) => {
            return(
            <div>
                {row.assessmentId ? (
                    <Link 
                        to="/seeker/company-profile" 
                        className="px-2 text-blue-600 hover:underline underline-offset-2"
                        title="Click to view assessment details">
                        {row.assessmentName || "Untitled Assessment"} {/* Use assessmentName */}
                    </Link>
                ) : (
                    <span className="px-2 cursor-default" title="assessment not available">
                        {row.assessmentName}
                    </span>
                )}
            </div>
        )}
    },
    { 
        key: "numberOfQuestions", // Changed to match backend property
        header: "Number of Questions",
        render: (row) => (
            <div className="px-2">
                {row.numberOfQuestions || "N/A"} {/* Assuming this comes from backend */}
            </div>
        )
    },
    {     
        key: "jobTitle", 
        header: "Job Title",
        render: (row) => (
            <div>
                {row.jobTitle}
            </div>
        )
    },
    {     
        key: "timeLimit", // Changed to match backend property
        header: "Time",
        render: (row) => (
            <div className="px-2">
                {row.assessmentTime ? `${row.assessmentTime} mins` : "N/A"} {/* Format time if needed */}
            </div>
        )
    },
    {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
            <div className="flex justify-center gap-2 w-full">
                {/* Edit Button (Blue) */}
                <Button
                    variant="primary"
                    className="h-7 text-sm w-[120px]"
                    onClick={() => handleEditAssessment(row.assessmentId)} 
                >
                    Edit Assessment
                </Button>
                
                {/* Delete Button (Red) */}
                <Button
                    className="h-7 text-sm w-[120px] bg-red-500 hover:bg-red-600 text-white rounded" 
                    onClick={() => handleDeleteAssessment(row.assessmentId)}
                >
                    Delete Assessment
                </Button>
            </div>
        )
    }
];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Assessments</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-20">


                    <FilterDropdown
                        label="Job Title"
                        options={JobTitles}
                        selectedValue={filters.jobTitle}
                        onSelect={(value) => setFilters({ jobTitle: value })}
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
}

export default CompanyAssessment;