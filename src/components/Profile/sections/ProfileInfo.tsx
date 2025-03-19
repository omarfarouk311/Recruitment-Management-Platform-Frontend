import { useState, useEffect } from "react";
import { Settings, Edit } from "lucide-react";
import useStore from "../../../stores/globalStore";
import ProfileDialog from "../../common/EditProfileDialog";
import CredentialsDialog from "../../common/AccountSettingDialog";
import { UserCredentials } from "../../../types/profile";
import Button from "../../common/Button";
import SkeletonLoader from "../../common/SkeletonLoader";

export default function ProfileInfo() {
    const profileInfo = useStore.useSeekerProfileInfo();
    const fetchProfileInfo = useStore.useSeekerProfileFetchInfo();
    const [isLoading, setIsLoading] = useState(true);
    const credentials = useStore.useSeekerCredentials();
    const updateCredentials = useStore.useSeekerSetCredentials();

    // State for Profile Dialog
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

    // State for Account Settings Dialog
    const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] =
        useState(false);

    // Handle saving credentials updates
    const handleSaveCredentials = (updatedCredentials: UserCredentials) => {
        updateCredentials(updatedCredentials); // Update the credentials in the store
        setIsAccountSettingsDialogOpen(false); // Close the account settings dialog
    };

    useEffect(() => {
        setIsLoading(true);
        fetchProfileInfo().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="h-[230px] overflow-hidden">
                    <SkeletonLoader />
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow mb-4">
                    <div className="flex items-center justify-between px-6 py-14 h-[230px]">
                        <div className="flex items-center">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                {profileInfo.image ? (
                                    <img
                                        src={profileInfo.image}
                                        alt={profileInfo.name}
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="h-24 w-24 text-4xl text-gray-400 flex items-center justify-center">
                                        {profileInfo.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div className="ml-6">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {profileInfo.name}
                                </h1>
                                <p className="text-gray-600">
                                    {profileInfo.country}
                                </p>
                                <p className="text-gray-600">
                                    {profileInfo.city}
                                </p>
                            </div>
                        </div>

                        {/* Vertical line divider */}
                        <div className="self-stretch w-px bg-black mx-6" />

                        <div className="flex flex-col space-y-6">
                            {/* Account Settings Button */}
                            <Button
                                variant="outline"
                                className="w-[150px]"
                                onClick={() =>
                                    setIsAccountSettingsDialogOpen(true)
                                } // Open the account settings dialog
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Account Settings
                            </Button>

                            {/* Edit Profile Button */}
                            <Button
                                variant="outline"
                                className="w-[150px]"
                                onClick={() => setIsProfileDialogOpen(true)} // Open the profile dialog
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Dialog */}
            <ProfileDialog
                isOpen={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                profileInfo={profileInfo}
            />

            {/* Account Settings Dialog */}
            <CredentialsDialog
                isOpen={isAccountSettingsDialogOpen}
                onClose={() => setIsAccountSettingsDialogOpen(false)}
                onSubmit={handleSaveCredentials}
                credentials={credentials}
            />
        </>
    );
}
