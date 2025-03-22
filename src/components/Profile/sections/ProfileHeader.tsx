import { useState } from "react";
import { Settings, Edit } from "lucide-react";
import Button from "../ui/Button";
import useStore from "../../../stores/globalStore";
import ProfileDialog from "../../common/EditProfileDialog"; // Import the ProfileDialog component
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
  id: string
  email: string;
  password: string;
}

export default function ProfileHeader() {
  const profile = useStore.useSeekerProfile();
  const updateProfile = useStore.useSeekerProfileSetProfile();
  const credentials = useStore.useSeekerCredentials(); // Get credentials from the store
  const updateCredentials = useStore.useSeekerSetCredentials(); // Get the update function from the store

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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-start justify-between pt-8 pb-6">
        <div className="flex items-center">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
            {!profile.avatar && (
              <span className="text-4xl text-gray-400">
                {profile.name.charAt(0)}
              </span>
            )}
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            )}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.country}</p>
            <p className="text-gray-600">{profile.city}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 pl-12">
          {/* Account Settings Button */}
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => setIsAccountSettingsDialogOpen(true)} // Open the account settings dialog
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>

          {/* Edit Profile Button */}
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => setIsProfileDialogOpen(true)} // Open the profile dialog
          >
            <Edit className="h-4 w-4 mr-2" />
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