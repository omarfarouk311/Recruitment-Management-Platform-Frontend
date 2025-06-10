import { useState } from "react";
import CompanyJobsCandidates from "./CompanyJobsCandidates";
import CompanyJobsList from "./CompanyJobsList";
import CompanyJobsRecruiters from "./CompanyJobsRecruiters";
import { PlusCircle } from "lucide-react";
import JobPostingDialog from "../common/JobPostingDialog";
import useStore from "../../stores/globalStore";

const CompanyJobs = () => {
    const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const addJob = useStore.useCompanyAddJob();
    const editJob = useStore.useCompanyEditJob();

    const handleAddJob = () => {
        setSelectedJobId(null); // Reset selected job ID for new job creation
        setIsJobDialogOpen(true);
    };

    const handleEditJob = (jobId: number) => {
        setSelectedJobId(jobId); // Set the selected job ID for editing
        setIsJobDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsJobDialogOpen(false);
    };

    return (
        <div className="grid grid-cols-[1.2fr_2.4fr] gap-5">
            <div className="bg-white p-4 rounded-3xl  border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">Jobs</h1>
                    <button
                        className="flex items-center text-sm font-semibold text-gray-500 hover:text-black"
                        title="Create a new job"
                        onClick={handleAddJob}
                    >
                        <PlusCircle size={30} />
                    </button>
                </div>
                <div className="overflow-y-auto space-y-6 h-[680px] p-2">
                    <CompanyJobsList editJob={handleEditJob} />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <CompanyJobsCandidates />
                <CompanyJobsRecruiters />
            </div>

            {/* Job Posting Dialog */}
            <JobPostingDialog
                isOpen={isJobDialogOpen}
                onClose={handleCloseDialog}
                jobId={selectedJobId}
                addJob={addJob}
                updateJob={editJob}
            />
        </div>
    );
};

export default CompanyJobs;
