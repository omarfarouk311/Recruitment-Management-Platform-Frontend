import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button";
import { XCircle, Upload } from "lucide-react";
import type { SeekerProfileInfo } from "../../types/profile";
import useStore from "../../stores/globalStore";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    image: z.string().min(1, "Image is required"),
    phone: z.string().refine((value) => isValidPhoneNumber(value), {
        message: "Invalid phone number",
    }),
    gender: z.enum(["male", "female", ""], {
        errorMap: () => ({ message: "Please select a gender" }),
    }),
    birthdate: z.string().refine((value) => {
        const date = new Date(value);
        const today = new Date();
        return date <= today;
    }, "Birthdate cannot be in the future"),
});

type FormData = z.infer<typeof schema>;

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profileInfo: SeekerProfileInfo;
}

const ProfileDialog = ({
    isOpen,
    onClose,
    profileInfo,
}: ProfileDialogProps) => {
    const updateProfile = useStore.useSeekerProfileUpdateInfo();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: profileInfo,
        mode: "onSubmit",
    });

    const image = watch("image");
    const phoneValue = watch("phone");

    useEffect(() => {
      reset(profileInfo);
    }, [isOpen]);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("image", reader.result as string, {
                    shouldValidate: true,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await updateProfile(data);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
                    <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <button
                                onClick={onClose}
                                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    {image ?? profileInfo.image ? (
                                        <img
                                            src={image ?? profileInfo.image}
                                            alt={profileInfo.name}
                                            className="w-36 h-36 rounded-full object-cover"
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <PhoneInput
                                    international={true}
                                    defaultCountry="US"
                                    value={phoneValue}
                                    onChange={(value) =>
                                        setValue("phone", value || "")
                                    }
                                    className={`phone-input-wrapper border border-gray-200 rounded-xl p-2 ${
                                        errors.phone ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="male"
                                            {...register("gender")}
                                            className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                        />
                                        Male
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="female"
                                            {...register("gender")}
                                            className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                        />
                                        Female
                                    </label>
                                </div>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>

                            {/* Birthdate */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    {...register("birthdate")}
                                    max={new Date().toISOString().split("T")[0]}
                                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.birthdate ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.birthdate && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.birthdate.message}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    {...register("country")}
                                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.country ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.country.message}
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <input
                                    type="text"
                                    {...register("city")}
                                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.city ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.city.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="!w-[30%]"
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

export default ProfileDialog;
