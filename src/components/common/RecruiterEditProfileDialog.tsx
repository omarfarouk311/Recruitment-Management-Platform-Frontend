import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import Button from "./Button";
import { XCircle, Upload } from "lucide-react";
import { RecruiterProfileInfo as UserProfile } from "../../types/profile";

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedProfile: UserProfile) => void;
    profile: UserProfile;
}

const ProfileDialog = ({ isOpen, onClose, onSubmit, profile }: ProfileDialogProps) => {
    const [updatedProfile, setUpdatedProfile] = useState<UserProfile>({
        ...profile,
        recruitername: profile.recruitername || '' // Ensure no undefined values
    });

    // Reset form when profile changes
    useEffect(() => {
        setUpdatedProfile({
            ...profile,
            recruitername: profile.recruitername || ''
        });
    }, [profile, isOpen]); // Added isOpen to reset when dialog reopens

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProfile(prev => ({
                    ...prev,
                    avatar: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(updatedProfile);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-3xl shadow-xl min-h-[300px]">
                    <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <Dialog.Title className="text-2xl font-bold">
                                Edit Profile
                            </Dialog.Title>
                            <button
                                type="button"
                                onClick={onClose}
                                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                                aria-label="Close dialog"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                                    {updatedProfile.avatar ? (
                                        <img
                                            src={updatedProfile.avatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <label className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span>Change Picture</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePictureChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Name Field - Fixed */}
                            <div className="space-y-2">
                                <label htmlFor="recruitername" className="text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="recruitername"
                                    name="recruitername"  // Changed from "name" to match your profile type
                                    value={updatedProfile.recruitername}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Add other fields here */}
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="primary"
                                className="!w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="!w-auto"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ProfileDialog;