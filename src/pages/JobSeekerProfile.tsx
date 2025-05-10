import ProfileInfo from "../components/Profile/sections/SeekerProfileInfo";
import ExperienceSection from "../components/Profile/sections/ExperienceSection";
import EducationSection from "../components/Profile/sections/EducationSection";
import SkillsSection from "../components/Profile/sections/SkillsSection";
import CVSection from "../components/Profile/sections/CVSection";
import ReviewsSection from "../components/Profile/sections/ReviewsSection";
import UserNav from "../components/Header/UserNav";
import { useEffect } from "react";
import useStore from "../stores/globalStore";
import { UserRole } from "../stores/User Slices/userSlice";
import { useParams } from "react-router-dom";

function JobSeekerProfile() {
  const clearProfile = useStore.useSeekerProfileClear();
  const userRole = useStore.useUserRole();
  const removeSkill = useStore.useSeekerProfileRemoveSkill();
  const fetchSkills = useStore.useSeekerProfileFetchSkills();
  const { userId, jobId } = useParams();
  const fetchAll = useStore.useSeekerProfileFetchAll();
  const setSelectedUser = useStore.useSetSeekerProfileSelectedSeekerData();

  useEffect(() => {
    if (userRole !== UserRole.SEEKER && userId && jobId) {
      setSelectedUser({
        seekerId: parseInt(userId),
        jobId: parseInt(jobId),
      });
      fetchAll();
    }
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
            <ExperienceSection
              removeExperience = {useStore.useSeekerProfileRemoveExperience()}
              fetchExperience = {useStore.useSeekerProfileFetchExperience()}
              useExperiences = {useStore.useSeekerProfileExperience}
              updateExperience= {useStore.useSeekerProfileUpdateExperience()}
              addExperience = {useStore.useSeekerProfileAddExperience()}
            />
            <EducationSection 
              removeEducation = {useStore.useSeekerProfileRemoveEducation()}
              fetchEducation = {useStore.useSeekerProfileFetchEducation()}
              useEducation={useStore.useSeekerProfileEducation}
              updateEducation={useStore.useSeekerProfileUpdateEducation()}
              addEducation={useStore.useSeekerProfileAddEducation()}
            />
            <SkillsSection 
              removeSkill={removeSkill}
              fetchSkills={fetchSkills}
              useSkills={useStore.useSeekerProfileSkills}
              addSkill={useStore.useSeekerProfileAddSkill()}
            />
            {userRole === UserRole.SEEKER && <ReviewsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerProfile;
