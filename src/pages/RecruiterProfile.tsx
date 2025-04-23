import ProfileHeader from "../components/Profile/sections/RecruiterProfileHeader";

function RecruiterProfile() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="flex-[1.5]">
              {" "}
              {/* Increase flex value to 1.5 */}
              <ProfileHeader />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterProfile;
