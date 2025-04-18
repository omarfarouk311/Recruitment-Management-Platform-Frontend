import { Dialog } from "@headlessui/react";
import { XCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import type { UserCredentials } from "../../types/profile";

// Zod schema for validation
const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

interface CredentialsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    credentials: UserCredentials;
    updateCredentials: (data: UserCredentials) => Promise<void>;
}

export default function CredentialsDialog({
    isOpen,
    onClose,
    credentials,
    updateCredentials
}: CredentialsDialogProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        trigger,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: credentials,
        mode: "onSubmit",
    });

    useEffect(() => {
        reset(credentials);
    }, [isOpen]);

    const handleFormSubmit = async (data: FormData) => {
        const isValid = await trigger();
        if (!isValid) return;
        await updateCredentials(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
                    <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold">
                                Edit Credentials
                            </h2>
                            <button
                                onClick={onClose}
                                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit(handleFormSubmit)}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            isPasswordVisible
                                                ? "text"
                                                : "password"
                                        }
                                        {...register("password")}
                                        className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPasswordVisible(
                                                !isPasswordVisible
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <Button
                                    type="submit"
                                    className="!w-[30%] !h-10"
                                    variant="primary"
                                    loading={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
