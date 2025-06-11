import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../components/common/Button.tsx";
import { Upload, X } from "lucide-react";
import useStore from "../stores/globalStore.ts";
import LocationSearch from "../components/common/LocationSearch.tsx";
import FilterDropdown from "../components/Filters/FilterDropdown.tsx";
import axios from "axios";
import { showErrorToast } from "../util/errorHandler.ts";
import { authRefreshToken } from "../util/authUtils.ts";
import config from "../../config/config.ts";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    overview: z.string().min(1, "Overview is required"),
    foundedIn: z.number().min(1800, "Invalid year").max(new Date().getFullYear(), "Year cannot be in future"),
    size: z.number().min(1, "Size must be at least 1"),
    type: z.enum(["Public", "Private"], {
        required_error: "Company type is required",
        invalid_type_error: "Company type must be Public or Private",
    }),
    image: z.union([
        z.string().min(1, "Image is required"),
        z.instanceof(File).refine((file) => file.size > 0, "Image is required"),
    ]),
    locations: z
        .array(
            z.object({
                country: z.string(),
                city: z.string(),
            })
        )
        .min(1, "At least one location is required"),
    industries: z
        .array(
            z.object({
                id: z.number(),
                name: z.string(),
            })
        )
        .min(1, "At least one industry is required"),
});

type FormData = z.infer<typeof schema>;

const CompanyFinishProfile = () => {
    const [tempCountry, setTempCountry] = useState("");
    const fetchIndustryOptions = useStore.useSharedEntitiesSetIndustryOptions();
    const industryOptions = useStore.useSharedEntitiesIndustryOptions();
    const [imageError, setImageError] = useState(false);
    const [progress, setProgress] = useState(0);
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
            overview: "",
            foundedIn: new Date().getFullYear(),
            size: 1,
            type: "Public",
            image: "",
            locations: [],
            industries: [],
        },
        mode: "onSubmit",
    });

    const { image, locations, industries, name, overview, foundedIn, size, type } = watch();

    useEffect(() => {
        setImageError(false);
    }, [image]);

    useEffect(() => {
        fetchIndustryOptions();
    }, []);

    // Calculate progress based on filled sections
    useEffect(() => {
        let filled = 0;
        if (locations.length > 0) filled++;
        if (industries.length > 0) filled++;
        if (name) filled++;
        if (overview) filled++;
        if (foundedIn) filled++;
        if (size) filled++;
        if (type) filled++;
        if (image) filled++;
        setProgress(Math.round((filled / 8) * 100));
    }, [locations, industries, name, overview, foundedIn, size, type, image]);

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

    const addLocation = (city: string) => {
        if (
            !tempCountry ||
            !city ||
            locations.some((loc) => loc.country === tempCountry && loc.city === city)
        ) {
            return;
        }

        setValue("locations", [...locations, { country: tempCountry, city }]);
        setTempCountry("");
    };

    const removeLocation = (index: number) => {
        setValue(
            "locations",
            locations.filter((_, i) => i !== index)
        );
    };

    const addIndustry = (value: string) => {
        const industry = industryOptions.find((opt) => opt.value === value);
        if (!industry || industries.some((ind) => ind.id === parseInt(industry.value))) return;
        setValue("industries", [...industries, { id: parseInt(industry.value), name: industry.label }]);
    };

    const removeIndustry = (industryId: number) => {
        setValue(
            "industries",
            industries.filter((ind) => ind.id !== industryId)
        );
    };

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post(
                `${config.API_BASE_URL}/companies/finish-profile`,
                {
                    name: data.name,
                    overview: data.overview,
                    type: data.type === "Public",
                    foundedIn: data.foundedIn,
                    size: data.size,
                    locations: data.locations,
                    industriesIds: data.industries.map((industry) => industry.id),
                },
                { withCredentials: true }
            );

            if (data.image instanceof File) {
                await axios.post(`${config.API_BASE_URL}/companies/${userId}/image`, data.image, {
                    headers: {
                        "Content-Type": data.image.type,
                        "File-Name": data.image.name,
                    },
                    withCredentials: true,
                });
            }

            setUserName(data.name);
            setUserImage(`${config.API_BASE_URL}/companies/${userId}/image?t=${Date.now()}`);

            window.scrollTo(0, 0);
            navigate("/company/dashboard", { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        onSubmit(data); // Retry submission after refreshing token
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
                    showErrorToast("Failed to create company profile");
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500 py-8">
            <div className="container mx-auto px-4 py-20 max-w-3xl">
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

                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            className={`w-full p-3 border rounded-xl ${
                                errors.name ? "border-red-500" : "border-gray-200"
                            }`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Overview */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Overview</label>
                        <textarea
                            {...register("overview")}
                            className={`w-full p-3 border rounded-xl h-32 ${
                                errors.overview ? "border-red-500" : "border-gray-200"
                            }`}
                        />
                        {errors.overview && (
                            <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>
                        )}
                    </div>

                    {/* Founded In */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Founded In</label>
                        <input
                            type="number"
                            {...register("foundedIn", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-xl ${
                                errors.foundedIn ? "border-red-500" : "border-gray-200"
                            }`}
                        />
                        {errors.foundedIn && (
                            <p className="text-red-500 text-sm mt-1">{errors.foundedIn.message}</p>
                        )}
                    </div>

                    {/* Company Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Size</label>
                        <input
                            type="number"
                            {...register("size", { valueAsNumber: true })}
                            className={`w-full p-3 border rounded-xl ${
                                errors.size ? "border-red-500" : "border-gray-200"
                            }`}
                        />
                        {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
                    </div>

                    {/* Company Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Type</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Public"
                                    {...register("type")}
                                    checked={watch("type") === "Public"}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">Public</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Private"
                                    {...register("type")}
                                    checked={watch("type") === "Private"}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">Private</span>
                            </label>
                        </div>
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                    </div>

                    {/* Locations Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">Locations</label>
                        <div className="flex gap-16">
                            <LocationSearch
                                selectedCountry={tempCountry}
                                onCountryChange={setTempCountry}
                                selectedCity={""}
                                onCityChange={addLocation}
                            />
                        </div>

                        {/* Location Chips */}
                        <div className="flex flex-wrap gap-2">
                            {locations.map((loc, index) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1"
                                >
                                    <span className="text-sm">
                                        {loc.country}, {loc.city}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(index)}
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.locations && (
                            <p className="text-red-500 text-sm mt-1">{errors.locations.message}</p>
                        )}
                    </div>

                    {/* Industries Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">Industries</label>
                        <FilterDropdown
                            label="Select Industries"
                            options={industryOptions}
                            onSelect={addIndustry}
                            selectedValue=""
                            addAnyOption={false}
                            className="!w-[40%]"
                        />

                        {/* Industry Chips */}
                        <div className="flex flex-wrap gap-2">
                            {industries.map((industry) => (
                                <div
                                    key={industry.id}
                                    className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1"
                                >
                                    <span className="text-sm">{industry.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeIndustry(industry.id)}
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.industries && (
                            <p className="text-red-500 text-sm mt-1">{errors.industries.message}</p>
                        )}
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

export default CompanyFinishProfile;
