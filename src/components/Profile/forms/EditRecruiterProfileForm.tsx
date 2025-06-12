import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button.tsx";
import { XCircle, Upload } from "lucide-react";
import type { RecruiterProfileInfo } from "../../../types/profile.ts";
import useStore from "../../../stores/globalStore.ts";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.union([z.string(), z.instanceof(File).refine((file) => file.size > 0, "Image is required")]),
});

type FormData = z.infer<typeof schema>;

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profileInfo: RecruiterProfileInfo;
}

const CompanyProfileDialog = ({ isOpen, onClose, profileInfo }: ProfileDialogProps) => {
    const updateProfile = useStore.useRecruiterProfileUpdateInfo();
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [profileInfo.image]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: profileInfo.name,
            image: profileInfo.image,
        },
        mode: "onSubmit",
    });

    const { image } = watch();

    useEffect(() => {
        reset({
            name: profileInfo.name,
            image: profileInfo.image,
        });
    }, [isOpen]);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("image", file, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: FormData) => {
        await updateProfile(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
                    <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold">Edit Company Profile</h2>
                            <button
                                onClick={onClose}
                                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    {image instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={profileInfo.name}
                                            className="w-36 h-36 rounded-full object-cover"
                                        />
                                    ) : image && !imageError ? (
                                        <img
                                            src={image as string}
                                            alt={profileInfo.name}
                                            className="w-36 h-36 rounded-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <span className="w-36 h-36 text-4xl text-gray-400 flex items-center justify-center">
                                            {profileInfo.name.charAt(0)}
                                        </span>
                                    )}
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
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                                )}
                            </div>

                            {/* Recruiter Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full p-3 border rounded-xl ${
                                        errors.name ? "border-red-500" : "border-gray-200"
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="!w-[30%] !h-10"
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
};

export default CompanyProfileDialog;
