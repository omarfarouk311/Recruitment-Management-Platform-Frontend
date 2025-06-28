import CompanyProcesses from "./CompanyRecruitmentProcesses";

const CompanyRecruitmentDashboardParent = () => {
    return (
        <div className="h-[770px] overflow-y-auto bg-white p-4 rounded-3xl hide-scrollbar border-2 border-gray-200 shadow">
            <CompanyProcesses />
        </div>
    );
};

export default CompanyRecruitmentDashboardParent;
