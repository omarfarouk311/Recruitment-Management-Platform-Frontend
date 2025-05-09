import CompanyJobsCandidates from "./CompanyJobsCandidates";
import JobList from "./CompanyJobsList";
import CompanyJobsRecruiters from "./CompanyJobsRecruiters";

const CompanyJobs = () => {


    return (

        <div className="grid grid-cols-[1fr_2.8fr] gap-5">
            <div className="h-[770px] overflow-y-auto space-y-6 bg-white p-4 rounded-3xl hide-scrollbar max-w-[500px] border-2 border-gray-200">
                <JobList />
            </div>

            <div className="flex flex-col gap-5">
                <CompanyJobsCandidates />
                <CompanyJobsRecruiters/>
                
            </div>
        </div>
    );

}

export default CompanyJobs;