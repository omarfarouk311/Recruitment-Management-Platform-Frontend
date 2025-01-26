import UserNav from "../components/Header/UserNav";
import TabGroup from "../components/Tabs/TabGroup";
import ForYouPage from "../components/ForYou/ForYou";

const JobSeekerHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="max-w-md mx-auto px-4">
        <TabGroup />
      </div>
      <div className="container mx-auto px-6 py-8">
        <ForYouPage />
      </div>
    </div>
  );
};

export default JobSeekerHome;
