import SkeletonLoader from "../components/common/SkeletonLoader";
import CompanyInvitations from "../components/Company Dashboard/CompanyInvitations";
import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import { companyDashboardTabs } from "../stores/Company Dashboard Slice/dashboardPageSlice";
import useStore from "../stores/globalStore";
import { useEffect } from "react";
import CompanyLogs from "../components/Company Dashboard/CompanyLogs";
import CompanyJobs from "../components/Company Dashboard/CompanyJobs";


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
      <div className="min-h-screen bg-gray-100 pt-1 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-8">
          <TabGroup
            tabs={[
              "Jobs",
              "Recruiters",
              "Logs",
              "Templates",
              "Recruiter Process",
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
           <CompanyJobs/>): null}
      </div>
    </>
  );
};

export default CompanyDashboard;
