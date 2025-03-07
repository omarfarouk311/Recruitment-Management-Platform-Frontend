import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import ForYou from "../components/Job Seeker-For You/ForYou";
import Companies from "../components/Job Seeker-Companies/Companies";
import { useState, useEffect } from "react";

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-6 rounded-3xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded mt-4"></div>
      </div>
    ))}
  </div>
);

const JobSeekerHome = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loadingTab, setLoadingTab] = useState<number | null>(null);

  useEffect(() => {
    if (loadingTab !== null) {
      const timer = setTimeout(() => {
        setActiveTab(loadingTab);
        setLoadingTab(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loadingTab]);

  const handleTabChange = (index: number) => {
    if (index !== activeTab) {
      setLoadingTab(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="max-w-md mx-auto px-4">
        <TabGroup
          tabs={["For You", "Companies"]}
          activeTab={activeTab}
          loadingTab={loadingTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="container mx-auto px-6 py-8">
        {loadingTab !== null ? (
          <SkeletonLoader />
        ) : activeTab === 0 ? (
          <ForYou />
        ) : (
          <Companies />
        )}
      </div>
    </div>
  );
};

export default JobSeekerHome;
