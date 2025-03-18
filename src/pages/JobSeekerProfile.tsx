import ProfileHeader from '../components/Profile/sections/ProfileHeader';
import ExperienceSection from '../components/Profile/sections/ExperienceSection';
import EducationSection from '../components/Profile/sections/EducationSection';
import SkillsSection from '../components/Profile/sections/SkillsSection';
import CVSection from '../components/Profile/sections/CVSection';
import ReviewsSection from '../components/Profile/sections/ReviewsSection';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="flex-[1.5]"> {/* Increase flex value to 1.5 */}
              <ProfileHeader />
            </div>
            <div className="flex-1 lg:flex-[2]">
              <CVSection />
            </div>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <ExperienceSection />
              <EducationSection />
              <div className="space-y-6">
                <SkillsSection />
                <ReviewsSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;