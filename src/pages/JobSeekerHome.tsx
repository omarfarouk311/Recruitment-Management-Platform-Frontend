import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import ForYou from "../components/Job Seeker-For You/ForYou";
import Companies from "../components/Job Seeker-Companies/Companies";
import SkeletonLoader from "../components/common/SkeletonLoader";
import SearchBar from "../components/common/SearchBar";
import useStore from "../stores/globalStore";
import { useEffect } from "react";
import { HomePageTabs } from "../stores/Seeker Home Slices/homePageSlice";

const JobSeekerHome = () => {
  const activeTab = useStore.useHomePageActiveTab();
  const loadingTab = useStore.useHomePageLoadingTab();
  const setActiveTab = useStore.useSetHomePageActiveTab();
  const useActiveTab = useStore.useHomePageActiveTab;
  const useLoadingTab = useStore.useHomePageLoadingTab;
  const useSetActiveTab = useStore.useSetHomePageActiveTab;
  const useApplySearch =
    activeTab === HomePageTabs.Companies
      ? useStore.useCompaniesTabApplySearch
      : useStore.useForYouTabApplySearch;
  const useIsLoading =
    activeTab === HomePageTabs.Companies
      ? useStore.useCompaniesTabIsCompaniesLoading
      : useStore.useForYouTabIsJobsLoading;
  const useSetSearchQuery =
    activeTab === HomePageTabs.Companies
      ? useStore.useCompaniesTabSetSearchQuery
      : useStore.useForYouTabSetSearchQuery;
  const useSearchQuery =
    activeTab === HomePageTabs.Companies
      ? useStore.useCompaniesTabSearchQuery
      : useStore.useForYouTabSearchQuery;

  useEffect(() => {
    if (activeTab === null) setActiveTab(HomePageTabs.ForYou);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav>
        <SearchBar
          useApplySearch={useApplySearch}
          useSetSearchQuery={useSetSearchQuery}
          useIsLoading={useIsLoading}
          useSearchQuery={useSearchQuery}
          placeHolder={
            activeTab === HomePageTabs.JobSearch ||
            activeTab === HomePageTabs.ForYou
              ? "Find your next job"
              : "Search for a company"
          }
          loadingTab={loadingTab}
        />
      </UserNav>

      <div className="max-w-md mx-auto px-4">
        <TabGroup
          tabs={["For You", "Companies"]}
          useActiveTab={useActiveTab}
          useLoadingTab={useLoadingTab}
          useSetActiveTab={useSetActiveTab}
        />
      </div>

      <div className="container mx-auto px-6 py-8">
        {loadingTab !== null ? (
          <SkeletonLoader />
        ) : activeTab === HomePageTabs.JobSearch ||
          activeTab === HomePageTabs.ForYou ? (
          <ForYou />
        ) : (
          <Companies />
        )}
      </div>
    </div>
  );
};

export default JobSeekerHome;
