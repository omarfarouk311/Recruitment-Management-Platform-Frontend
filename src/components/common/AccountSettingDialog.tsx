import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import Button from "../common/Button";
import { XCircle, Eye, EyeOff } from "lucide-react"; // Import eye icons

interface UserCredentials {
    id: string;
    email: string;
    password: string;
}

interface CredentialsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedCredentials: UserCredentials) => void;
    credentials: UserCredentials;
}

const CredentialsDialog = ({ isOpen, onClose, onSubmit, credentials }: CredentialsDialogProps) => {
    const [updatedCredentials, setUpdatedCredentials] = useState<UserCredentials>(credentials);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to track password visibility

    // Reset form when credentials change
    useEffect(() => {
        setUpdatedCredentials(credentials);
    }, [credentials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(updatedCredentials); // Submit the updated credentials
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev); // Toggle password visibility
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
                    <div className="p-8 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold" id="dialog-heading">
                                Edit Credentials
                            </h2>
                            <button onClick={onClose}>
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedCredentials.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={isPasswordVisible ? "text" : "password"} // Toggle input type
                                        name="password"
                                        value={updatedCredentials.password}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your password"
                                    />
                                    {/* Toggle Password Visibility Button */}
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeOff className="w-5 h-5" /> // Eye-off icon when password is visible
                                        ) : (
                                            <Eye className="w-5 h-5" /> // Eye icon when password is hidden
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                                className="rounded-full"
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

export default CredentialsDialog;