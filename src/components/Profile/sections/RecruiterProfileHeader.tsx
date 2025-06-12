import { useState, useEffect } from "react";
import { Edit, Settings } from "lucide-react";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";
import EditProfileDialog from "../forms/EditRecruiterProfileForm";
import CredentialsDialog from "../../common/AccountSettingDialog";

const ProfileHeaderSkeleton = () => (
    <div className="bg-white rounded-2xl shadow p-12 w-full max-w-2xl flex mx-auto animate-pulse">
        {/* Left Side Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 pr-8">
            <div className="w-32 h-32 bg-gray-300 rounded-full" />
            <div className="h-4 bg-gray-300 rounded w-24" />
        </div>

        {/* Vertical Line */}
        <div className="h-48 border-l border-gray-300" />

        {/* Right Side Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 pl-16">
            <div className="h-12 w-full bg-gray-300 rounded-3xl" />
            <div className="h-12 w-full bg-gray-300 rounded-3xl" />
        </div>
    </div>
);

export default function ProfileHeader() {
    const [isLoading, setIsLoading] = useState(true);
    const profileInfo = useStore.useRecruiterProfileInfo();
    const fetchRecruiterProfile = useStore.useRecruiterProfileFetchInfo();
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);
    const credentials = useStore.useRecruiterCredentials();
    const updateCredentials = useStore.useRecruiterProfileUpdateCredentials();

    useEffect(() => {
        setImageError(false);
    }, [profileInfo.image]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchRecruiterProfile();
            setIsLoading(false);
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="pt-40 bg-gray-100 min-h-screen">
                <ProfileHeaderSkeleton />
            </div>
        );
    }

    return (
        <div className="pt-40 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-3xl shadow p-12 w-full max-w-2xl flex mx-auto border-2 border-gray-200">
                {/* Left Side: Profile Photo and Name */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 pr-8">
                    {!imageError && profileInfo.image ? (
                        <img
                            src={profileInfo.image as string}
                            onError={() => setImageError(true)}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xl text-gray-500">{profileInfo.name.charAt(0)}</span>
                        </div>
                    )}
                    <h2 className="text-xl font-medium text-gray-700">{profileInfo.name}</h2>
                </div>

                <div className="h-48 border-l border-gray-300"></div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-8 pl-16">
                    <Button
                        variant="outline"
                        className="w-[150px] !p-1"
                        onClick={() => setIsProfileDialogOpen(true)}
                    >
                        <Edit className="mr-2" size={20} />
                        Edit Profile
                    </Button>

                    <Button
                        variant="outline"
                        className="w-[150px] !p-1"
                        onClick={() => setIsAccountSettingsDialogOpen(true)}
                    >
                        <Settings className="mr-2" size={20} />
                        Account Settings
                    </Button>
                </div>
            </div>

            <EditProfileDialog
                isOpen={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                profileInfo={profileInfo}
            />

            <CredentialsDialog
                isOpen={isAccountSettingsDialogOpen}
                onClose={() => setIsAccountSettingsDialogOpen(false)}
                credentials={credentials}
                updateCredentials={updateCredentials}
            />
        </div>
    );
}
