import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import useStore from "../stores/globalStore";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { useEffect } from "react";
import { recruiterDashboardTabs } from "../stores/Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import RecruiterInvitations from "../components/Recruiter Dashboard/RecruiterInvitations";
import RecruiterInterviews from "../components/Recruiter Dashboard/RecruiterInterviews";

const SeekerDashboard = () => {
    const activeTab = useStore.useRecruiterDashboardActiveTab();
    const loadingTab = useStore.useRecruiterDashboardLoadingTab();
    const setActiveTab = useStore.useSetRecruiterDashboardActiveTab();
    const useActiveTab = useStore.useRecruiterDashboardActiveTab;
    const useLoadingTab = useStore.useRecruiterDashboardLoadingTab;
    const useSetActiveTab = useStore.useSetRecruiterDashboardActiveTab;

    useEffect(() => {
        if(activeTab === null) setActiveTab(recruiterDashboardTabs.interviews);
    }, []);

    return (
        <>
        <UserNav />
        <div className="min-h-screen bg-gray-100 pt-1 px-4 pb-20 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <TabGroup
                    tabs={["Candidates", "Interviews", "Job Offer Sent", "Invitations"]}
                    useActiveTab={useActiveTab}
                    useLoadingTab={useLoadingTab}
                    useSetActiveTab={useSetActiveTab}
                />
                </div>
                
                {
                    <div className="mt-8">
                       {loadingTab !== null ? (
                            <SkeletonLoader />
                        ) : activeTab == 1 ? (
                            <RecruiterInterviews />
                        ) : activeTab == 3 ? (
                            <RecruiterInvitations />
                        ) : null}
                            
                    </div>
                    
                } 
        </div>
        </>
    );
};

export default SeekerDashboard;