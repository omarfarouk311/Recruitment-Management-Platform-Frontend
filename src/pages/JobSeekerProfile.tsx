import ProfileInfo from "../components/Profile/sections/SeekerProfileInfo";
import ExperienceSection from "../components/Profile/sections/ExperienceSection";
import EducationSection from "../components/Profile/sections/EducationSection";
import SkillsSection from "../components/Profile/sections/SkillsSection";
import CVSection from "../components/Profile/sections/CVSection";
import ReviewsSection from "../components/Profile/sections/ReviewsSection";
import UserNav from "../components/Header/UserNav";
import { useEffect } from "react";
import useStore from "../stores/globalStore";

function JobSeekerProfile() {
  const clearProfile = useStore.useSeekerProfileClear();

  useEffect(() => {
    return () => {
      clearProfile();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="flex-[1.5]">
            <ProfileInfo />
          </div>
          <div className="flex-1 lg:flex-[2]">
            <CVSection />
          </div>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-10">
            <ExperienceSection />
            <EducationSection />
            <SkillsSection />
            <ReviewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerProfile;
