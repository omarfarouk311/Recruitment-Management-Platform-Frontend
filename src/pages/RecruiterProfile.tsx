import UserNav from "../components/Header/UserNav";
import ProfileHeader from "../components/Profile/sections/RecruiterProfileHeader";

function RecruiterProfile() {
    return (
        <div className="min-h-screen bg-gray-100">
            <UserNav />
            <div className="p-8">
                <ProfileHeader />
            </div>
        </div>
    );
}

export default RecruiterProfile;
