import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button.tsx";
import { XCircle, X } from "lucide-react";
import LocationSearch from "./LocationSearch.tsx";
import FilterDropdown from "../Filters/FilterDropdown.tsx";
import useStore from "../../stores/globalStore.ts";
import axios from "axios";
import { showErrorToast } from "../../util/errorHandler.ts";
import { authRefreshToken } from "../../util/authUtils.ts";
import config from "../../../config/config.ts";
import SkeletonLoader from "./SkeletonLoader.tsx";

// Define skill levels (importance levels)
const skillLevels = [
    { value: "1", label: "1 - Basic" },
    { value: "2", label: "2 - Familiar" },
    { value: "3", label: "3 - Intermediate" },
    { value: "4", label: "4 - Advanced" },
    { value: "5", label: "5 - Expert" },
];

// Zod schema for validation
const schema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
    processId: z.number().min(1, "Recruitment process is required"),
    industryId: z.number().min(1, "Industry is required"),
    appliedCntLimit: z.number().min(1, "Max applicants limit is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    remote: z.number().min(0).max(1),
    skills: z
        .array(
            z.object({
                skillId: z.number().min(1, "Skill is required"),
                importance: z.number().min(1).max(5),
            })
        )
        .min(3, "At least three skill is required"),
});

type FormData = z.infer<typeof schema>;

interface JobPostingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: number | null;
    addJob: (job: any) => Promise<void>;
    updateJob: (job: any, jobId: number) => Promise<void>;
}

const JobPostingDialog = ({ isOpen, onClose, jobId, addJob, updateJob }: JobPostingDialogProps) => {
    const [tempSkillId, setTempSkillId] = useState("");
    const [tempSkillImportance, setTempSkillImportance] = useState("");
    const [recruitmentProcessOptions, setRecruitmentProcessOptions] = useState<
        { value: string; label: string }[]
    >([]);
    const industryOptions = useStore.useSharedEntitiesIndustryOptions();
    const setIndustryOptions = useStore.useSharedEntitiesSetIndustryOptions();
    const [skillOptions, setSkillOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isLoadingJobData, setIsLoadingJobData] = useState(false);

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
            jobTitle: "",
            jobDescription: "",
            processId: -1,
            industryId: -1,
            appliedCntLimit: 0,
            country: "",
            city: "",
            remote: 0,
            skills: [],
        },
        mode: "onSubmit",
    });

    const skills = watch("skills");
    const selectedCountry = watch("country");
    const selectedCity = watch("city");
    const isRemote = watch("remote");
    const processId = watch("processId");
    const industryId = watch("industryId");

    // Fetch options from backend
    useEffect(() => {
        if (!isOpen) return;

        const fetchOptions = async () => {
            setIsLoadingOptions(true);
            try {
                // Fetch recruitment processes, skills, and industries
                const processesPromise = axios.get(`${config.API_BASE_URL}/recruitment_processes`, {
                    params: { page: 1 },
                    withCredentials: true,
                });
                const skillsPromise = axios.get(`${config.API_BASE_URL}/skills`, { withCredentials: true });
                const [processesResponse, skillsResponse] = await Promise.all([
                    processesPromise,
                    skillsPromise,
                    setIndustryOptions(),
                ]);

                if (processesResponse.data.recruitment_process !== undefined) {
                    setRecruitmentProcessOptions(
                        processesResponse.data.recruitment_process.map((p: { id: number; name: string }) => ({
                            value: p.id.toString(),
                            label: p.name,
                        }))
                    );
                }

                setSkillOptions(
                    skillsResponse.data.map((s: { id: number; name: string }) => ({
                        value: s.id.toString(),
                        label: s.name,
                    }))
                );
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        const succeeded = await authRefreshToken();
                        if (succeeded) {
                            fetchOptions();
                        }
                    } else {
                        showErrorToast("Failed to fetch recruitment processes, skills, or industries");
                    }
                }
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchOptions();
        if (!jobId) {
            reset({
                jobTitle: "",
                jobDescription: "",
                processId: -1,
                industryId: -1,
                appliedCntLimit: 0,
                country: "",
                city: "",
                remote: 0,
                skills: [],
            });
            setTempSkillId("");
            setTempSkillImportance("");
        }
    }, [isOpen]);

    // Fetch job data for editing
    useEffect(() => {
        if (!isOpen || !jobId) return;

        const fetchJobData = async () => {
            setIsLoadingJobData(true);
            try {
                const response = await axios.get(`${config.API_BASE_URL}/jobs/${jobId}/edit`, {
                    withCredentials: true,
                });
                const jobData = response.data.jobData[0];
                const skillsData = response.data.skillsData;

                reset({
                    jobTitle: jobData.job_title,
                    jobDescription: jobData.job_description,
                    processId: jobData.recruitment_process_id,
                    industryId: jobData.industry_id,
                    appliedCntLimit: jobData.applied_cnt_limit,
                    country: jobData.country,
                    city: jobData.city,
                    remote: jobData.remote ? 1 : 0,
                    skills: skillsData.map((skill: any) => ({
                        skillId: skill.skill_id,
                        importance: skill.skill_importance,
                    })),
                });
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        const succeeded = await authRefreshToken();
                        if (succeeded) {
                            fetchJobData();
                        }
                    } else if (err.response?.status === 404) {
                        showErrorToast("Job not found");
                        onClose();
                    } else {
                        showErrorToast("Failed to fetch job details");
                    }
                }
            } finally {
                setIsLoadingJobData(false);
            }
        };

        fetchJobData();
    }, [isOpen, jobId]);

    const addSkill = () => {
        if (!tempSkillId || !tempSkillImportance) return;

        const skill = skillOptions.find((opt) => opt.value === tempSkillId);
        if (!skill || skills.some((s) => s.skillId === parseInt(tempSkillId))) return;

        setValue("skills", [
            ...skills,
            {
                skillId: parseInt(tempSkillId),
                importance: parseInt(tempSkillImportance),
            },
        ]);
        setTempSkillId("");
        setTempSkillImportance("");
    };

    const removeSkill = (index: number) => {
        setValue(
            "skills",
            skills.filter((_, i) => i !== index)
        );
    };

    const toggleRemote = () => {
        setValue("remote", isRemote ? 0 : 1, { shouldValidate: true });
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (jobId) await updateJob(data, jobId);
            else {
                await addJob(data);
                window.location.reload();
            }
            onClose();
        } catch (err) {
            console.error("Error submitting job data:", err);
        }
    };

    useEffect(() => {
        if (tempSkillId && tempSkillImportance) {
            addSkill();
        }
    }, [tempSkillId, tempSkillImportance]);

    const isLoading = isLoadingOptions || isLoadingJobData;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
                    <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold">{jobId ? "Edit Job" : "Post a Job"}</h2>
                            <button
                                onClick={onClose}
                                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="h-[550px]">
                                <SkeletonLoader />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        {...register("jobTitle")}
                                        className={`w-full p-3 border rounded-xl ${
                                            errors.jobTitle ? "border-red-500" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.jobTitle && (
                                        <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                                    )}
                                </div>

                                {/* Job Description */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Job Description</label>
                                    <textarea
                                        {...register("jobDescription")}
                                        className={`w-full p-3 border rounded-xl h-32 ${
                                            errors.jobDescription ? "border-red-500" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.jobDescription && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.jobDescription.message}
                                        </p>
                                    )}
                                </div>

                                {/* Remote Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remote"
                                        checked={!!isRemote}
                                        onChange={toggleRemote}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="remote" className="font-medium text-gray-700">
                                        This is a remote position
                                    </label>
                                </div>

                                {/* Location */}
                                <div className="space-y-4">
                                    <label className="font-medium text-gray-700">Location</label>
                                    <div className="flex gap-8">
                                        <LocationSearch
                                            selectedCountry={selectedCountry}
                                            onCountryChange={(value) => {
                                                setValue("country", value, { shouldValidate: true });
                                                setValue("city", "", { shouldValidate: true });
                                            }}
                                            selectedCity={selectedCity}
                                            onCityChange={(value) =>
                                                setValue("city", value, { shouldValidate: true })
                                            }
                                        />
                                    </div>
                                    <div className="flex space-x-6">
                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.country.message}
                                            </p>
                                        )}
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Section */}
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Required Skills</label>
                                    <div className="flex gap-8">
                                        <div className="flex-1">
                                            <label className="text-sm text-gray-500">Skill</label>
                                            <FilterDropdown
                                                label="Select Skill"
                                                options={skillOptions}
                                                onSelect={(value) => setTempSkillId(value)}
                                                selectedValue={tempSkillId}
                                                addAnyOption={false}
                                                disabled={isLoadingOptions}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm text-gray-500">Importance Level</label>
                                            <FilterDropdown
                                                label="Select Level"
                                                options={skillLevels}
                                                onSelect={(value) => setTempSkillImportance(value)}
                                                selectedValue={tempSkillImportance}
                                                addAnyOption={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => {
                                        const skillName = skillOptions.find(
                                            (opt) => opt.value === skill.skillId.toString()
                                        )?.label;
                                        const importanceLabel = skillLevels.find(
                                            (level) => level.value === skill.importance.toString()
                                        )?.label;

                                        return (
                                            <div
                                                key={index}
                                                className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1"
                                            >
                                                <span className="text-sm">
                                                    {skillName} ({importanceLabel})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(index)}
                                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.skills && (
                                    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                                )}

                                <div className="space-y-2">
                                    <div className="flex gap-8">
                                        {/* Recruitment Process */}
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-gray-700">
                                                Recruitment Process
                                            </label>
                                            <FilterDropdown
                                                label={isLoadingOptions ? "Loading..." : "Select Process"}
                                                options={recruitmentProcessOptions}
                                                onSelect={(value) =>
                                                    setValue("processId", value ? parseInt(value) : -1, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                selectedValue={processId === -1 ? "" : processId.toString()}
                                                addAnyOption={true}
                                            />
                                            {errors.processId && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.processId.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Industry */}
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-gray-700">Industry</label>
                                            <FilterDropdown
                                                label={isLoadingOptions ? "Loading..." : "Select Industry"}
                                                options={industryOptions}
                                                onSelect={(value) =>
                                                    setValue("industryId", value ? parseInt(value) : -1, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                selectedValue={industryId === -1 ? "" : industryId.toString()}
                                                addAnyOption={true}
                                            />

                                            {errors.industryId && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.industryId.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Max Applicants */}
                                <div className="space-y-2 flex flex-col">
                                    <label className="font-medium text-gray-700">Max Applicants</label>
                                    <input
                                        type="number"
                                        {...register("appliedCntLimit", { valueAsNumber: true })}
                                        className={`max-w-[285px] p-3 border rounded-xl ${
                                            errors.appliedCntLimit ? "border-red-500" : "border-gray-200"
                                        }`}
                                        min="0"
                                    />
                                    {errors.appliedCntLimit && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.appliedCntLimit.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="!w-[30%] !h-10"
                                        loading={isSubmitting}
                                    >
                                        {jobId ? "Update Job" : "Post Job"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default JobPostingDialog;
