import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { authRefreshToken } from "../util/authUtils";
import { showErrorToast } from "../util/errorHandler";

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const allSkills = useStore.useSeekerProfileSkillsFormData();
    const fetchAllSkills = useStore.useSeekerProfileFetchSkillsFormData();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [progress, setProgress] = useState(0);
    const [gender, setGender] = useState<"male" | "female" | "">("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [educations, setEducations] = useState<Education[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [selectedCity, setSelectedCity] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<Value>();
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const name = useStore.useUserName();
    const userId = useStore.useUserId();

    // Calculate progress based on filled sections
    useEffect(() => {
        let filled = 0;
        if (selectedSkills.length > 0) filled++;
        if (experiences.length > 0) filled++;
        if (gender) filled++;
        if (cvFile) filled++;
        if (profilePhoto) filled++;
        if (selectedCountry) filled++;
        if (selectedCity) filled++;
        if (phoneNumber) filled++;
        setProgress(Math.round((filled / 8) * 100));
    }, [
        selectedSkills,
        experiences,
        gender,
        cvFile,
        profilePhoto,
        selectedCountry,
        selectedCity,
        phoneNumber,
    ]);

    useEffect(() => {
        fetchAllSkills();
    }, []);

    const handleAddSkill = (skillId: number) => {
        let skill = allSkills.find((skill: Skill) => skill.id === skillId);
        skill = {id: 5, name: 'nodejs'}
        if (
            skillId &&
            !selectedSkills.find((skill: Skill) => skill.id === skillId) &&
            skill
        ) {
            setSelectedSkills((prev) => [...prev, skill]);
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
        if (experience.position && experience.companyName && experience.id) {
            setExperiences((prev) => {
                return prev.map((exp) => {
                    if (exp.id === experience.id) {
                        return experience;
                    }
                    return exp;
                });
            });
        }
    };

    const handleRemoveExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleAddEducation = (edu: Education) => {
        setEducations((prev) => {
            edu.id = prev.length;
            return [...prev, edu];
        });
    };

    const handleRemoveEducation = (id: number) => {
        setEducations((prev) => prev.filter((_, i) => i !== id));
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

    const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setCvFile(event.target.files[0]);
        }
    };

    const handleProfilePhotoUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePhoto(event.target.files[0]);
        }
    };

    const sendBasicInfo = async () => {
        try {
            let res;
            const body = {
                name,
                city: selectedCity?.value,
                country: selectedCountry?.value,
                gender: gender == "male",
                phoneNumber: phoneNumber?.toString(),
                dateOfBirth: birthDate?.toISOString(),
            };
            console.log(body);
            try {
                res = await axios.post(
                    `${config.API_BASE_URL}/seekers/profiles/finish-profile`,
                    body
                );
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }
            }
            if (!res) {
                res = await axios.post(
                    `${config.API_BASE_URL}/seekers/profiles/finish-profile`,
                    body
                );
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.forEach((value: string) =>
                    showErrorToast(`Validation Error: ${value}`)
                );
            } else {
                showErrorToast(`Something went wrong!`);
            }
            throw err;
        }
    };

    const sendProfilePhoto = async () => {
        try {
            let imageRes;
            if (profilePhoto instanceof File) {
                try {
                    imageRes = await axios.post(
                        `${config.API_BASE_URL}/seekers/profiles/${userId}/image`,
                        profilePhoto,
                        {
                            headers: {
                                "Content-Type": "image/jpeg",
                                "File-Name": profilePhoto.name,
                            },
                        }
                    );
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        if (err.response?.status === 401) {
                            authRefreshToken();
                        } else {
                            throw err;
                        }
                    } else {
                        throw err;
                    }
                }
                if (!imageRes) {
                    imageRes = await axios.post(
                        `${config.API_BASE_URL}/seekers/profiles/${userId}/image`,
                        profilePhoto,
                        {
                            headers: {
                                "Content-Type": "image/jpeg",
                                "File-Name": profilePhoto.name,
                            },
                        }
                    );
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.forEach((value: string) =>
                    showErrorToast(`Validation Error: ${value}`)
                );
            } else {
                showErrorToast(`Something went wrong!`);
            }
            throw err;
        }
    };

    const sendCV = async () => {
        try {
            if (cvFile) {
                let res;
                try {
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/cvs`,
                        cvFile,
                        {
                            headers: {
                                "File-Name": cvFile.name,
                                "Content-Type": cvFile.type,
                            },
                        }
                    );
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        if (err.response?.status === 401) {
                            await authRefreshToken();
                        } else {
                            throw err;
                        }
                    } else {
                        throw err;
                    }
                }
                if (!res) {
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/cvs`,
                        cvFile,
                        {
                            headers: {
                                "File-Name": cvFile.name,
                                "Content-Type": cvFile.type,
                            },
                        }
                    );
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.forEach((value: string) =>
                    showErrorToast(`Validation Error: ${value}`)
                );
            } else {
                showErrorToast(`Something went wrong!`);
            }
            throw err;
        }
    };

    const sendSkills = async () => {
        try {
            let res;
            let body = {
                skills: selectedSkills.map((skill: Skill) => ({
                    skillId: skill.id,
                })),
            };
            try {
                res = await axios.post(
                    `${config.API_BASE_URL}/seekers/skills`,
                    body
                );
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    } else {
                        throw err;
                    }
                } else {
                    throw err;
                }
            }
            if (!res) {
                res = await axios.post(
                    `${config.API_BASE_URL}/seekers/skills`,
                    body
                );
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.forEach((value: string) =>
                    showErrorToast(`Validation Error: ${value}`)
                );
            } else {
                showErrorToast(`Something went wrong!`);
            }
            throw err;
        }
    };

    const sendExperiences = async () => {
        experiences.forEach(async (exp: Experience) => {
            let body = {
                companyName: exp.companyName,
                jobTitle: exp.position,
                startDate: exp.startDate
                    ? new Date(exp.startDate).toISOString()
                    : undefined,
                endDate: exp.endDate
                    ? new Date(exp.endDate).toISOString()
                    : undefined,
                description: exp.description,
            };
            try {
                let res;
                try {
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/experiences`,
                        body
                    );
                } catch (err) {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 401
                    ) {
                        await authRefreshToken();
                    } else {
                        throw err;
                    }
                }
                if (!res)
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/experiences`,
                        body
                    );
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 400) {
                    err.response?.data.validationErrors.forEach(
                        (value: string) =>
                            showErrorToast(`Validation Error: ${value}`)
                    );
                } else {
                    showErrorToast(`Something went wrong!`);
                }
                throw err;
            }
        });
    };

    const sendEducations = async () => {
        educations.forEach(async (edu: Education) => {
            let body = {
                school_name: edu.institution,
                degree: edu.degree,
                field: edu.fieldOfStudy,
                grade: edu.grade,
                start_date: edu.startDate
                    ? new Date(edu.startDate).toISOString()
                    : undefined,
                end_date: edu.endDate
                    ? new Date(edu.endDate).toISOString()
                    : undefined,
            };
            try {
                let res;
                try {
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/educations/add`,
                        body
                    );
                } catch (err) {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 401
                    ) {
                        await authRefreshToken();
                    } else {
                        throw err;
                    }
                }
                if (!res)
                    res = await axios.post(
                        `${config.API_BASE_URL}/seekers/educations/add`,
                        body
                    );
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 400) {
                    err.response?.data.validationErrors.forEach(
                        (value: string) =>
                            showErrorToast(`Validation Error: ${value}`)
                    );
                } else {
                    showErrorToast(`Something went wrong!`);
                }
                throw err;
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Add profile setup logic here
        try {
            // send base info
            await sendBasicInfo();
            // send experience, edu, skills, photo and cv
            let promises = [
                sendExperiences(),
                sendProfilePhoto(),
                sendCV(),
                sendSkills(),
                sendEducations(),
            ];
            await Promise.all(promises);
            setLoading(false);
            navigate("/seeker/home");
        } catch {
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
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
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
                                            accept=".pdf,.doc,.docx"
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
                                        <p className="text-sm text-gray-600 truncate w-32 absolute left-1/2 transform -translate-x-1/2 mt-2">
                                            {cvFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Phone Number Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                        international
                                        defaultCountry="US"
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        placeholder="Enter phone number"
                                        className="react-phone-input w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Date Of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            birthDate
                                                ? birthDate
                                                      .toISOString()
                                                      .slice(0, 10)
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setBirthDate(
                                                e.target.value
                                                    ? new Date(e.target.value)
                                                    : null
                                            )
                                        }
                                        className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                    />
                                </div>
                                {/* Country Select */}
                                <div className="flex gap-4 my-6">
                                    <LocationSearch
                                        onCityChange={(
                                            selectedOption: string
                                        ) =>
                                            setSelectedCity({
                                                label: selectedOption,
                                                value: selectedOption,
                                            })
                                        }
                                        onCountryChange={(
                                            selectedOption: string
                                        ) =>
                                            setSelectedCountry({
                                                label: selectedOption,
                                                value: selectedOption,
                                            })
                                        }
                                        selectedCity={selectedCity?.value || ""}
                                        selectedCountry={
                                            selectedCountry?.value || ""
                                        }
                                    />
                                </div>
                            </div>

                            {/* Gender Selection */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="gender"
                                            value="male"
                                            checked={gender === "male"}
                                            onChange={(e) =>
                                                setGender(
                                                    e.target.value as
                                                        | "male"
                                                        | "female"
                                                )
                                            }
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="gender"
                                            value="female"
                                            checked={gender === "female"}
                                            onChange={(e) =>
                                                setGender(
                                                    e.target.value as
                                                        | "male"
                                                        | "female"
                                                )
                                            }
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
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
                            <Button type="button" onClick={handleSubmit} loading={loading}>
                                Complete Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
