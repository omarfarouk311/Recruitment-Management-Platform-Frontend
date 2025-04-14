import { useState, useEffect } from "react";
import { Settings, Edit } from "lucide-react";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";
import ProfileDialog from "../../common/RecruiterEditProfileDialog"; // Import the ProfileDialog component
import CredentialsDialog from "../../common/AccountSettingDialog"; // Import the CredentialsDialog component
import { RecruiterProfileInfo as UserProfile } from "../../../types/profile";
import axios from 'axios';
import SkeletonLoader from "../../common/SkeletonLoader";


export default function ProfileHeader() {
    const [isLoading, setIsLoading] = useState(true);

    const profile = useStore.useRecruiterProfile();
    const fetchRecruiterProfile = useStore.useFetchRecruiterProfile();
    const updateProfile = useStore.useUpdateRecruiterProfile();

    const credentials = useStore.useRecruiterCredentials(); // Get credentials from the store

    // State for Profile Dialog
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

    // State for Account Settings Dialog
    const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);

    // Handle saving profile updates
    const handleSaveProfile = async (data: UserProfile) => {
        let cleanup: () => void;

        try {
            console.log(data)
            cleanup = await updateProfile(data);
            alert("Profile saved!");
        } catch (error) {
            if (!axios.isCancel(error)) {
                alert(`Error`)
                console.log(error)
            }
        }

        return () => {
            // Cancel request if component unmounts
            cleanup?.();
        };
    }

    useEffect(() => {
        let cleanup: () => void;

        const loadData = async () => {
            try {
                setIsLoading(true);
                cleanup = await fetchRecruiterProfile(); // Get cleanup function
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Failed to load profile:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        

        loadData();

        return () => {
            // Cancel request if component unmounts
            cleanup?.();
        };
    }, []);


    return (
        isLoading ? (
            <div className="h-[230px] overflow-hidden">
                <SkeletonLoader />
            </div>
        ) :
         ( <div className="pt-40 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-2xl shadow p-12 w-full max-w-2xl flex mx-auto">
                {/* Left Side: Profile Photo and Name */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 pr-8">
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {!profile.avatar && (
                            <span className="text-4xl text-gray-400">
                                {profile.recruitername}
                            </span>
                        )}
                        {profile.avatar && (
                            <img
                                src={profile.avatar}
                                alt={profile.recruitername}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    {/* User Name */}
                    <h2 className="text-xl font-medium text-gray-700">{profile.recruitername}</h2>
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
                credentials={credentials}
                updateCredentials={async (data) => {
                    useStore.getState().updateRecruiterCredentials(data);
                }}
            />
        </div>
            )
    );
}