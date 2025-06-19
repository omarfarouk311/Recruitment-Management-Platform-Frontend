import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../components/common/Button.tsx";
import { Upload } from "lucide-react";
import useStore from "../stores/globalStore.ts";
import axios from "axios";
import { showErrorToast } from "../util/errorHandler.ts";
import { authRefreshToken } from "../util/authUtils.ts";
import config from "../../config/config.ts";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.union([
        z.string().min(1, "Image is required"),
        z.instanceof(File).refine((file) => file.size > 0, "Image is required"),
    ]),
});

type FormData = z.infer<typeof schema>;

const RecruiterFinishProfile = () => {
    const [imageError, setImageError] = useState(false);
    const userId = useStore.useUserId();
    const setUserName = useStore.useUserSetName();
    const setUserImage = useStore.useUserSetImage();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            image: "",
        },
        mode: "onSubmit",
    });

    const { image, name } = watch();

    useEffect(() => {
        setImageError(false);
    }, [image]);

    const filled = [name, image].filter(Boolean).length;
    const progress = Math.round((filled / 2) * 100);

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
        try {
            await axios.post(
                `${config.API_BASE_URL}/recruiters/finish-profile`,
                { recruiterName: data.name },
                { withCredentials: true }
            );

            if (data.image instanceof File) {
                await axios.put(`${config.API_BASE_URL}/recruiters/profile-pic`, data.image, {
                    headers: {
                        "Content-Type": data.image.type,
                        "File-Name": data.image.name,
                    },
                    withCredentials: true,
                });
            }

            setUserName(data.name);
            setUserImage(`${config.API_BASE_URL}/recruiters/${userId}/profile-pic?t=${Date.now()}`);

            window.scrollTo(0, 0);
            navigate("/recruiter/dashboard", { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await onSubmit(data); // Retry submission after refreshing token
                    }
                } else if (err.response?.status === 400) {
                    if (err.response.data.message !== "Validation Error") {
                        showErrorToast(err.response.data.message);
                    } else {
                        const validationErrors: string[] = err.response.data.validationErrors;
                        validationErrors.forEach((error) => {
                            showErrorToast(error);
                        });
                    }
                } else if (err.response?.status === 413) {
                    showErrorToast("Image size exceeded 10MB");
                } else {
                    showErrorToast("Failed to create recruiter profile");
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500 py-8">
            <div className="container mx-auto px-4 py-2 max-w-3xl">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white rounded-2xl shadow-xl p-8 space-y-12"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Complete your profile</h1>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 text-right">{progress}% Complete</div>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            {image instanceof File ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Profile Picture"
                                    className="w-36 h-36 rounded-full object-cover"
                                />
                            ) : image && !imageError ? (
                                <img
                                    src={image as string}
                                    alt="Profile Picture"
                                    className="w-36 h-36 rounded-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span className="w-36 h-36 text-4xl text-gray-400 flex items-center justify-center">
                                    {name.charAt(0)}
                                </span>
                            )}
                        </div>

                        <label className="cursor-pointer flex items-center gap-2 text-blue-500">
                            <Upload className="w-4 h-4" />
                            <span>{image ? "Change Picture" : "Upload Picture"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                                className="hidden"
                            />
                        </label>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
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
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            className="!w-[30%] !h-10"
                            loading={isSubmitting}
                        >
                            Complete Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterFinishProfile;
