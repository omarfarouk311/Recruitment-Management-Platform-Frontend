import { Settings, Edit } from 'lucide-react';
import Button from '../ui/Button';
import  useStore from '../../../stores/globalStore';

export default function ProfileHeader() {
  const profile = useStore.useSeekerProfile();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-start justify-between pt-8 pb-6">
        <div className="flex items-center ">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center ">
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
            <p className="text-gray-600">{profile.location}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 pl-12" >
          <Button variant="outline" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
          <Button variant="outline" className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}