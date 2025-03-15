import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import Button from "./Button";
import { XCircle, Upload } from "lucide-react";
import { UserProfile } from "../../types/profile";

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedProfile: UserProfile) => void;
    profile: UserProfile;
}

const ProfileDialog = ({ isOpen, onClose, onSubmit, profile }: ProfileDialogProps) => {
    const [updatedProfile, setUpdatedProfile] = useState<UserProfile>(profile);

    // Reset form when profile changes
    useEffect(() => {
        setUpdatedProfile(profile);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProfile((prev) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        onSubmit(updatedProfile); // Submit the updated profile
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-2xl bg-white rounded-3xl shadow-xl min-h-[300px]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dialog-heading"
                >
                    <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold" id="dialog-heading">
                                Edit Profile
                            </h2>
                            <button onClick={onClose}  className="hover:bg-gray-200 rounded-full p-2 transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                    <img
                                        src={updatedProfile.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label className="cursor-pointer flex items-center gap-2 text-blue-500">
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

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedProfile.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={updatedProfile.country}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your country"
                                />
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={updatedProfile.city}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your city"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                                className="!w-auto"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProfileDialog;