import SkeletonLoader from "../components/common/SkeletonLoader";
import CompanyInvitations from "../components/Company Dashboard/CompanyInvitations";
import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import { companyDashboardTabs } from "../stores/Company Dashboard Slice/dashboardPageSlice";
import useStore from "../stores/globalStore";
import { useEffect } from "react";
import CompanyLogs from "../components/Company Dashboard/CompanyLogs";
import CompanyJobs from "../components/Company Dashboard/CompanyJobs";
import CompanyRecruiters from "../components/Company Dashboard/CompanyRecruitersParent";import CompanyAssessments from "../components/Company Dashboard/CompanyAssessments";
import CompanyTemplatesDashboard from "../components/Company Dashboard/CompanyTemplates";
import CompanyRecruitmentDashboardParent from "../components/Company Dashboard/CompanyRecruitmentDashboardPraent";

const CompanyDashboard = () => {
  const activeTab = useStore.useCompanyDashboardActiveTab();
  const loadingTab = useStore.useCompanyDashboardLoadingTab();
  const setActiveTab = useStore.useSetCompanyDashboardActiveTab();
  const useActiveTab = useStore.useCompanyDashboardActiveTab;
  const useLoadingTab = useStore.useCompanyDashboardLoadingTab;
  const useSetActiveTab = useStore.useSetCompanyDashboardActiveTab;
  const companyInvitationsTabClear = useStore.useCompanyInvitationsTabClear();
  useEffect(() => {
    setActiveTab(companyDashboardTabs.jobs);
    return () => {
      companyInvitationsTabClear();
    };
  }, []);

  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-gray-100 pt-1 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <TabGroup
            tabs={[
              "Jobs",
              "Recruiters",
              "Logs",
              "Templates",
              "Recruitement Processes",
              "Assessments",
              "Invitations",
            ]}
            useActiveTab={useActiveTab}
            useLoadingTab={useLoadingTab}
            useSetActiveTab={useSetActiveTab}
          />
        </div>

        {loadingTab !== null ? (
          <SkeletonLoader />
        ) : activeTab == companyDashboardTabs.invitations ? (
          <CompanyInvitations />
        ) : activeTab == companyDashboardTabs.logs ? (
          <CompanyLogs />
        ) : activeTab == companyDashboardTabs.jobs ? (
           <CompanyJobs/>)
          : activeTab == companyDashboardTabs.assessments ? (
            <CompanyAssessments/>
        ): activeTab == companyDashboardTabs.recruiters? (
          <CompanyRecruiters />
        ): activeTab == companyDashboardTabs.recruiterProcess ? (
          <CompanyRecruitmentDashboardParent />
        ): activeTab == companyDashboardTabs.templates ? (
          <CompanyTemplatesDashboard />
        ) : null}  
      </div>
    </>
  );
};

export default CompanyDashboard;
