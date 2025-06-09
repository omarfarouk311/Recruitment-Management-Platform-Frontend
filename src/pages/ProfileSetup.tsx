import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { Upload, FileText, User, FileInput } from "lucide-react";
import PhoneInput, { Value } from "react-phone-number-input"; // Import Value type
import "react-phone-number-input/style.css"; // Import the styles
import ExperienceSection from "../components/Profile/sections/ExperienceSection";
import EducationSection from "../components/Profile/sections/EducationSection";
import SkillsSection from "../components/Profile/sections/SkillsSection";
import { Education, Experience, Skill } from "../types/profile";
import useStore from "../stores/globalStore";
import LocationSearch from "../components/common/LocationSearch";
import config from "../../config/config";
import axios, { AxiosResponse } from "axios";
import { authRefreshToken } from "../util/authUtils";
import { showErrorToast } from "../util/errorHandler";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string(),
    gender: z.enum(["male", "female"]),
    birthDate: z.date(),
    country: z.string(),
    city: z.string(),
    cvFile: z
        .custom<File>()
        .refine(
            (file) => file?.type === "application/pdf",
            "Only PDF files are accepted"
        ),
    profilePhoto: z
        .custom<File>()
        .refine(
            (file) =>
                file?.type.startsWith("image/") &&
                ["image/jpeg", "image/png"].includes(file?.type),
            "Only JPEG/PNG images are accepted"
        )
});

type FormValues = z.infer<typeof formSchema>;

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const allSkills = useStore.useSeekerProfileSkillsFormData();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [progress, setProgress] = useState(0);
    const [educations, setEducations] = useState<Education[]>([]);
    const [parsingIsLoading, setParsingIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit: formHandleSubmit,
        setValue,
        watch,
        formState: { errors },
        trigger,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phoneNumber: undefined,
            gender: undefined,
            birthDate: undefined,
            country: "",
            city: "",
        },
    });

    // Watch form values for progress calculation
    const {
        name,
        phoneNumber,
        gender,
        birthDate,
        country,
        city,
        cvFile,
        profilePhoto,
    } = watch();

    // Calculate progress based on filled sections
    useEffect(() => {
        let filled = 0;
        if (selectedSkills.length > 0) filled++;
        if (experiences.length > 0) filled++;
        if (gender) filled++;
        if (cvFile) filled++;
        if (profilePhoto) filled++;
        if (country) filled++;
        if (city) filled++;
        if (phoneNumber) filled++;
        setProgress(Math.round((filled / 8) * 100));
    }, [
        selectedSkills,
        experiences,
        cvFile,
        profilePhoto,
        country,
        city,
        phoneNumber,
        gender,
    ]);

    const handleAddSkill = (skillId: number) => {
        let skill = allSkills.find((skill: Skill) => skill.id === skillId);
        const duplicate = selectedSkills.find(
            (skill: Skill) => skill.id === skillId
        );
        if (skillId && !duplicate && skill) {
            setSelectedSkills((prev) => [...prev, skill]);
        } else if (duplicate) {
            showErrorToast("Skill already exists.");
        }
    };

    const handleRemoveSkill = (id: number) => {
        setSelectedSkills((prev) => prev.filter((skill) => skill.id !== id));
    };

    const handleAddExperience = (experience: Experience) => {
        if (experience.position && experience.companyName) {
            setExperiences((prev) => {
                experience.id = prev.length;
                return [...prev, experience];
            });
        }
    };

    const handleEditExperience = (experience: Experience) => {
        if (
            experience.position &&
            experience.companyName &&
            experience.id !== undefined
        ) {
            setExperiences((prev) => {
                return prev.map((exp) => {
                    if (exp.id === experience.id) {
                        return experience;
                    }
                    return exp;
                });
            });
        } else {
            showErrorToast("Please fill in all fields before saving.");
            throw new Error("Please fill in all fields before saving.");
        }
    };

    const handleRemoveExperience = (id: number) => {
        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    };

    const handleAddEducation = (edu: Education) => {
        setEducations((prev) => {
            edu.id = prev.length;
            return [...prev, edu];
        });
    };

    const handleRemoveEducation = (id: number) => {
        setEducations((prev) => prev.filter((edu) => edu.id !== id));
    };

    const handleEditEducation = (edu: Education) => {
        setEducations((prev) =>
            prev.map((e) => {
                if (e.id === edu.id) {
                    return edu;
                }
                return e;
            })
        );
    };

    const handleCvUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files[0] && !parsingIsLoading) {
            setValue("cvFile", event.target.files[0], { shouldValidate: true });
            await trigger("cvFile");

            setParsingIsLoading(true);
            let res: AxiosResponse<any, any>;
            try {
                try {
                    res = await axios.post(
                        `${config.API_BASE_URL}/cvs`,
                        event.target.files[0],
                        {
                            headers: {
                                "File-Name": event.target.files[0].name,
                                "Content-Type": event.target.files[0].type,
                            },
                        }
                    );
                } catch (err) {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 401
                    ) {
                        await authRefreshToken();
                        res = await axios.post(
                            `${config.API_BASE_URL}/cvs`,
                            cvFile
                        );
                    } else {
                        throw err;
                    }
                }
                // set education
                if (res.data.education) {
                    setEducations((edus) => [
                        ...edus,
                        ...res.data.education.map(
                            (edu: any, index: number) => ({
                                id: edus.length + index,
                                institution: edu.university,
                                degree: edu.degree,
                                fieldOfStudy: edu.faculty,
                                grade: edu.grade,
                                startDate: edu["start Year"]
                                    ? format(
                                          new Date(edu["start Year"]),
                                          "MMM yyyy"
                                      )
                                    : undefined,
                                endDate:
                                    edu["End Year"] == "present"
                                        ? undefined
                                        : edu["End Year"]
                                        ? format(
                                              new Date(edu["End Year"]),
                                              "MMM yyyy"
                                          )
                                        : undefined,
                            })
                        ),
                    ]);
                }
                // set experience
                if (res.data.workExperience) {
                    setExperiences((exps) => [
                        ...exps,
                        ...res.data.workExperience.map(
                            (exp: any, index: number) => ({
                                id: exps.length + index,
                                companyName: exp.company,
                                position: exp.title,
                                startDate: exp["start date"]
                                    ? format(
                                          new Date(exp["start date"]),
                                          "MMM yyyy"
                                      )
                                    : undefined,
                                endDate:
                                    exp["end date"] === "present"
                                        ? undefined
                                        : exp["end date"]
                                        ? format(
                                              new Date(exp["end date"]),
                                              "MMM yyyy"
                                          )
                                        : undefined,
                                description: "",
                            })
                        ),
                    ]);
                }
                // set skills
                if (res.data.skills) {
                    setSelectedSkills((skills) => [
                        ...skills,
                        ...res.data.skills.map((skill: any) => ({
                            id: skill.id,
                            name: skill.name,
                        })),
                    ]);
                }
                // set name
                if (res.data.contactInformation.name) {
                    setValue("name", res.data.contactInformation.name);
                }
                // set phoneNumber
                if (res.data.contactInformation.phone) {
                    setValue("phoneNumber", res.data.contactInformation.phone);
                }
                setParsingIsLoading(false);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 400) {
                    err.response?.data.validationErrors.forEach(
                        (value: string) =>
                            showErrorToast(`Validation Error: ${value}`)
                    );
                }
            }
        } else if (parsingIsLoading) {
            showErrorToast("Parsing is already in progress. Please wait.");
        }
    };

    const handleProfilePhotoUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files[0]) {
            setValue("profilePhoto", event.target.files[0]);
            trigger("profilePhoto"); // Validate immediately
        }
    };

    const handleSubmit = async (
        formValues: FormValues,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setLoading(true);
        // Add profile setup logic here
        try {
            const data = {
                name: formValues.name,
                city: formValues.city,
                country: formValues.country,
                gender: formValues.gender === "male",
                phoneNumber: formValues.phoneNumber,
                dateOfBirth: formValues.birthDate?.toISOString(),
                experiences: experiences.map((exp) => ({
                    companyName: exp.companyName,
                    jobTitle: exp.position,
                    startDate: exp.startDate
                        ? new Date(exp.startDate).toISOString()
                        : undefined,
                    endDate: exp.endDate
                        ? new Date(exp.endDate).toISOString()
                        : undefined,
                    description: exp.description,
                    city: exp.city,
                    country: exp.country,
                })),
                skills: selectedSkills.map((skill: Skill) => skill.id),
                educations: educations.map((edu) => ({
                    schoolName: edu.institution,
                    degree: edu.degree,
                    field: edu.fieldOfStudy,
                    grade: edu.grade,
                    startDate: edu.startDate
                        ? new Date(edu.startDate).toISOString()
                        : undefined,
                    endDate: edu.endDate
                        ? new Date(edu.endDate).toISOString()
                        : undefined,
                })),
            };
            console.log("Submitting profile data:", data);
            const form = new FormData();
            form.append("data", JSON.stringify(data));
            if (profilePhoto) {
                form.append("profilePhoto", profilePhoto);
            }
            if (cvFile) {
                form.append("cvFile", cvFile);
            }
            try {
                await axios.post(
                    `${config.API_BASE_URL}/seekers/profiles/finish-profile`,
                    form,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                navigate("/seeker/home");
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    await authRefreshToken();
                    await axios.post(
                        `${config.API_BASE_URL}/seekers/profiles/finish-profile`,
                        form,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    
                    navigate("/seeker/home");
                } else if (
                    axios.isAxiosError(err) &&
                    err.response?.status === 400
                ) {
                    err.response?.data.validationErrors.forEach(
                        (value: string) =>
                            showErrorToast(`Validation Error: ${value}`)
                    );
                }
                else if (axios.isAxiosError(err) && err.response?.status === 409) {
                    showErrorToast(
                        "Phone number is already registered."
                    );
                }
                else {
                    throw err;
                }
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            showErrorToast(`Something went wrong!`);
            setLoading(false);
        }
    };

    // Get file icon based on file type
    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith(".pdf")) {
            return (
                <img
                    src="https://th.bing.com/th/id/OIP.ZpfRSZQmY7TTSOOGwZm1PAHaJS?w=162&h=203&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                    alt="PDF Icon"
                    className="w-10 h-10"
                />
            );
        } else {
            return <FileInput className="w-10 h-10 text-gray-400" />; // Fallback for other file types
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <form
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
                    onSubmit={formHandleSubmit(handleSubmit)}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Complete your profile
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Tell us more about yourself
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 text-right">
                            {progress}% Complete
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Basic Info Section */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4">
                                Basic Information
                            </h2>
                            <div className="flex items-center justify-center mb-20 gap-20">
                                {" "}
                                {/* Increased gap */}
                                {/* Profile Photo Upload */}
                                <div className="text-center">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                                            {profilePhoto ? (
                                                <img
                                                    src={URL.createObjectURL(
                                                        profilePhoto
                                                    )}
                                                    alt="Profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-10 h-10 text-gray-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="profileUpload"
                                            onChange={handleProfilePhotoUpload}
                                            accept="image/*"
                                        />
                                        <label
                                            htmlFor="profileUpload"
                                            className="absolute bottom-0 right-0 bg-black text-white p-3 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                                        >
                                            <Upload className="w-5 h-5" />
                                        </label>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Upload Profile Photo
                                    </p>
                                    {errors.profilePhoto && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {errors.profilePhoto.message}
                                        </p>
                                    )}
                                </div>
                                {/* CV Upload */}
                                <div className="text-center relative">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                                            {cvFile ? (
                                                getFileIcon(cvFile.name)
                                            ) : (
                                                <FileText className="w-10 h-10 text-gray-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="cvUpload"
                                            onChange={handleCvUpload}
                                            accept=".pdf"
                                        />
                                        <label
                                            htmlFor="cvUpload"
                                            className="absolute bottom-0 right-0 bg-black text-white p-3 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                                        >
                                            <Upload className="w-5 h-5" />
                                        </label>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Upload CV
                                    </p>
                                    {cvFile && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {cvFile.name}
                                        </p>
                                    )}
                                    {errors.cvFile && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {errors.cvFile.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        {...register("name")}
                                        placeholder="Enter Full Name"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Number Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                        international
                                        defaultCountry="US"
                                        value={phoneNumber}
                                        onChange={(value) =>
                                            setValue(
                                                "phoneNumber",
                                                value?.toString() || ""
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        className="react-phone-input w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-red-500 text-sm">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Date Of Birth
                                    </label>
                                    <input
                                        type="date"
                                        {...register("birthDate", {
                                            valueAsDate: true,
                                        })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.birthDate && (
                                        <p className="text-red-500 text-sm">
                                            {errors.birthDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Gender Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gender
                                    </label>
                                    <div className="flex gap-6 mx-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                {...register("gender")}
                                                value="male"
                                                className="form-radio"
                                            />
                                            <span className="ml-2">Male</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                {...register("gender")}
                                                value="female"
                                                className="form-radio"
                                            />
                                            <span className="ml-2">Female</span>
                                        </label>
                                    </div>
                                    {errors.gender && (
                                        <p className="text-red-500 text-sm">
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location Search */}
                            <div className="flex gap-4 my-10">
                                <LocationSearch
                                    onCountryChange={
                                        (selectedOption) =>
                                            setValue("country", selectedOption)
                                    }
                                    onCityChange={
                                        (selectedOption) =>
                                            setValue("city", selectedOption)
                                    }
                                    selectedCity={city || ""}
                                    selectedCountry={country || ""}
                                />
                            </div>
                            {errors.country && (
                                <p className="text-red-500 text-sm">
                                    {errors.country.message}
                                </p>
                            )}
                            {errors.city && (
                                <p className="text-red-500 text-sm">
                                    {errors.city.message}
                                </p>
                            )}
                        </section>

                        {/* Skills Section */}
                        <SkillsSection
                            addSkill={handleAddSkill}
                            removeSkill={handleRemoveSkill}
                            useSkills={() => selectedSkills}
                        />

                        {/* Experience Section */}
                        <ExperienceSection
                            addExperience={handleAddExperience}
                            removeExperience={handleRemoveExperience}
                            useExperiences={() => experiences}
                            updateExperience={handleEditExperience}
                        />

                        {/* Education Section */}
                        <EducationSection
                            addEducation={handleAddEducation}
                            removeEducation={handleRemoveEducation}
                            useEducation={() => educations}
                            updateEducation={handleEditEducation}
                        />

                        {/* Submit Button */}
                        <div className="pt-6 border-t">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                            >
                                Complete Profile
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
