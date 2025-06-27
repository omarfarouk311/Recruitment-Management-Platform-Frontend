import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { assessment, InvitationsStatusFilterOptions,AssessmentFilters } from "../../types/companyDashboard";
import { useEffect } from "react";
import { PlusCircle } from 'lucide-react';
import FilterDropdown from "../Filters/FilterDropdown";
import AssessmentDialog from "../common/assessmentDialog";
import LocationSearch from "../common/LocationSearch"
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";

import axios from "axios";
import config from "../../../config/config.ts";
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';


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
    //    console.log('Edit clicked for assessment:', assessmentId);
          window.location.href = `/company/assessment/${assessmentId}`;
   };
   const handleDeleteAssessment = async(assessmentId:number) => {
     if (!assessmentId) {
    console.error("Invalid assessment ID:", assessmentId);
    showErrorToast("Invalid assessment ID");
    return;
  }

  try {
    const response = await axios.delete(
      `${config.API_BASE_URL}/assessments/${assessmentId}`,
      {
        withCredentials: true,
      }
    );
      if (response.status === 200 || response.status === 204) {
      useStore.setState((state) => ({
        companyAssessmentsData: state.companyAssessmentsData.filter(
          (a) => a.assessmentId !== assessmentId
        ),
      }));
    }
    
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        const succeeded = await authRefreshToken();
        if (succeeded) {
          await handleDeleteAssessment(assessmentId); // retry
        } else {
          showErrorToast("Session expired. Please login again.");
        }
      } else if (err.response?.status === 400) {
        console.error("400 Bad Request:", err.response.data);
        showErrorToast("Bad request: check assessment ID or permissions / assessment has been assigned to recruitment process");
      } else {
        console.error(err);
        showErrorToast("Failed to delete assessment");
      }
    } else {
      showErrorToast("Unexpected error occurred");
    }
  }
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
                    className="min-w-0 w-auto px-1 py-1"
                    onClick={() => { handleEditAssessment(row.assessmentId) }}
                >
                    Edit
                </Button>
                
                {/* Delete Button (Red) */}
                <Button
                    variant="report" 
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

                    <button
                        className="flex items-center text-sm font-semibold text-gray-500 hover:text-black"
                        title="Add a new recruiter"
                        onClick={() => {
                            window.location.href = "/company/assessment";
                        }}
                    >
                        <PlusCircle size={30} />
                    </button>
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
}

export default CompanyAssessment;