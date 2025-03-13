import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import useStore from "../stores/globalStore";
import SeekerJobsAppliedFor from "../components/SeekerJobsAppliedFor/SeekerJobsAppliedFor";
import SeekerAssessments from "../components/SeekerAssessments/SeekerAssessments"; // Correct import
import SkeletonLoader from "../components/common/SkeletonLoader";
import { useEffect } from "react";
import { seekerDashboardTabs } from "../stores/Seeker Dashboard Slices/dashboardPageSlice";
import SeekerInterviews from "../components/SeekerInterviews/SeekerInterviews";

const SeekerDashboard = () => {
    const activeTab = useStore.useSeekerDashboardActiveTab();
    const loadingTab = useStore.useSeekerDashboardLoadingTab();
    const setActiveTab = useStore.useSetSeekerDashboardActiveTab();
    const useActiveTab = useStore.useSeekerDashboardActiveTab;
    const useLoadingTab = useStore.useSeekerDashboardLoadingTab;
    const useSetActiveTab = useStore.useSetSeekerDashboardActiveTab;

    useEffect(() => {
        try {
            if (activeTab === null) setActiveTab(seekerDashboardTabs.interviews);
        } catch (error) {
            console.error("Failed to set active tab:", error);
        }
    }, [activeTab, setActiveTab]);

    return (
        <>
            <UserNav />
            <div className="min-h-screen bg-gray-100 pt-1 px-4 pb-20 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <TabGroup
                        tabs={["Jobs Applied For", "Assessments", "Interviews", "Offers"]}
                        useActiveTab={useActiveTab}
                        useLoadingTab={useLoadingTab}
                        useSetActiveTab={useSetActiveTab}
                    />
                </div>
                {loadingTab !== null ? (
                    <SkeletonLoader />
                ) : activeTab === seekerDashboardTabs.jobsAppliedFor ? (
                    <SeekerJobsAppliedFor />
                ) : activeTab === seekerDashboardTabs.assessments ? (
                    <SeekerAssessments /> // Render the Assessments component
                ) : activeTab === seekerDashboardTabs.interviews ? (
                    <SeekerInterviews /> // Render the Assessments component
                ): null}
            </div>
        </>
    );
};

export default SeekerDashboard;