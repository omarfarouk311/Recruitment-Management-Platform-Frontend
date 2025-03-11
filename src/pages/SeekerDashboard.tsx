import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import useStore from "../stores/globalStore";
import SeekerJobsAppliedFor from "../components/Seeker Dashboard/SeekerJobsAppliedFor";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { useEffect } from "react";
import { seekerDashboardTabs } from "../stores/Seeker Dashboard Slices/dashboardPageSlice";
import SeekerStats from "../components/Seeker Dashboard/SeekerStats";

const SeekerDashboard = () => {
    const activeTab = useStore.useSeekerDashboardActiveTab();
    const loadingTab = useStore.useSeekerDashboardLoadingTab();
    const setActiveTab = useStore.useSetSeekerDashboardActiveTab();
    const useActiveTab = useStore.useSeekerDashboardActiveTab;
    const useLoadingTab = useStore.useSeekerDashboardLoadingTab;
    const useSetActiveTab = useStore.useSetSeekerDashboardActiveTab;

    useEffect(() => {
        if(activeTab === null) setActiveTab(seekerDashboardTabs.jobsAppliedFor);
    }, []);

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
            <SeekerStats />
            {loadingTab !== null ? (
                <SkeletonLoader />
            ) : activeTab == 0 ? (
                <SeekerJobsAppliedFor />
            ) : null}
        </div>
        </>
    );
};

export default SeekerDashboard;