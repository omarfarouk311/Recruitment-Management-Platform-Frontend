import { useState } from "react";
import { Settings, Edit } from "lucide-react";
import Button from "../ui/Button";
import useStore from "../../../stores/globalStore";
import ProfileDialog from "../../common/RecruiterEditProfileDialog"; // Import the ProfileDialog component
import CredentialsDialog from "../../common/AccountSettingDialog"; // Import the CredentialsDialog component

interface UserProfile {
    id: string;
    avatar: string;
    name: string;
    country: string;
    city: string;
    phone: string;
    gender: string;
    birthDate: string;
    role: string;
}

export interface UserCredentials {
    id: string;
    email: string;
    password: string;
}

export default function ProfileHeader() {
    const profile = useStore.useRecruiterProfile();
    const updateProfile = useStore.useRecruiterProfileSetProfile();
    const credentials = useStore.useRecruiterCredentials(); // Get credentials from the store
    const updateCredentials = useStore.useRecruiterSetCredentials(); // Get the update function from the store

    // State for Profile Dialog
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

    // State for Account Settings Dialog
    const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);

    // Handle saving profile updates
    const handleSaveProfile = (updatedProfile: UserProfile) => {
        updateProfile(updatedProfile); // Update the profile in the store
        setIsProfileDialogOpen(false); // Close the profile dialog
    };

    // Handle saving credentials updates
    const handleSaveCredentials = (updatedCredentials: UserCredentials) => {
        updateCredentials(updatedCredentials); // Update the credentials in the store
        setIsAccountSettingsDialogOpen(false); // Close the account settings dialog
    };

    return (
        <div className="pt-40 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-2xl shadow p-12 w-full max-w-2xl flex mx-auto">
                {/* Left Side: Profile Photo and Name */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 pr-8">
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {!profile.avatar && (
                            <span className="text-4xl text-gray-400">
                                {profile.name.charAt(0)}
                            </span>
                        )}
                        {profile.avatar && (
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    {/* User Name */}
                    <h2 className="text-xl font-medium text-gray-700">{profile.name}</h2>
                </div>

                {/* Vertical Line */}
                <div className="h-40 border-l border-gray-200"></div>

                {/* Right Side: Buttons */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 pl-8">
                    {/* Account Settings Button */}
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center rounded-lg py-3"
                        onClick={() => setIsAccountSettingsDialogOpen(true)} // Open the account settings dialog
                    >
                        <Settings className="h-5 w-5 mr-2" />
                        Account Settings
                    </Button>

                    {/* Edit Profile Button */}
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center rounded-lg py-3"
                        onClick={() => setIsProfileDialogOpen(true)} // Open the profile dialog
                    >
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Profile Dialog */}
            <ProfileDialog
                isOpen={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                onSubmit={handleSaveProfile}
                profile={profile}
            />

            {/* Account Settings Dialog */}
            <CredentialsDialog
                isOpen={isAccountSettingsDialogOpen}
                onClose={() => setIsAccountSettingsDialogOpen(false)}
                onSubmit={handleSaveCredentials}
                credentials={credentials}
            />
        </div>
    );
}