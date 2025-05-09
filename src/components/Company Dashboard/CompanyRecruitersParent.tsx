
import CompanyRecruiters from "./CompanyRecruiters";
import CompanyAssignedCandidates  from './CompanyAssignedCandidates';

const CompanyRecruitersParent = () => {


    return (

    <div className="grid grid-cols-[1fr_1fr] gap-5">
        <div className="h-[770px] overflow-y-auto space-y-6 bg-white p-4 rounded-3xl hide-scrollbar border-2 border-gray-200">
            <CompanyRecruiters />
        </div>
        <div className="h-[770px] overflow-y-auto space-y-6 bg-white p-4 rounded-3xl hide-scrollbar border-2 border-gray-200">
            <CompanyAssignedCandidates />
        </div>
    </div>
    );

}

export default CompanyRecruitersParent;