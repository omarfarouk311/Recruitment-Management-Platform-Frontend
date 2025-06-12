import { useState } from "react";
import useStore from "../../../stores/globalStore";

const RecruiterInfoSkeleton = () => (
    <div className="bg-white rounded-3xl shadow p-8 w-full flex mx-auto border-2 border-gray-200 animate-pulse">
        {/* Left Side Skeleton */}
        <div className="flex-1 flex flex-col pr-8 items-center justify-center">
            <div className="flex items-center space-x-8 mb-12">
                <div className="w-24 h-24 bg-gray-300 rounded-full" />
                <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-48" />
                    <div className="h-5 bg-gray-300 rounded w-32" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-32" />
                <div className="h-5 bg-gray-300 rounded w-40" />
            </div>
        </div>

        {/* Vertical Line */}
        <div className="h-48 border-l border-gray-300" />

        {/* Right Side Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center pl-16">
            <div className="h-16 w-16 bg-gray-300 rounded-full mb-8" />
            <div className="h-8 bg-gray-300 rounded w-48" />
        </div>
    </div>
);

interface RecruiterInfoProps {
    isLoading: boolean;
}

export default function RecruiterInfo({ isLoading }: RecruiterInfoProps) {
    const [imageError, setImageError] = useState(false);
    const recruiterInfo = useStore.useRecruiterCompanyInfo();

    if (isLoading) {
        return <RecruiterInfoSkeleton />;
    }

    return (
        <div className="bg-white rounded-3xl shadow p-8 w-full flex mx-auto border-2 border-gray-200">
            {/* Left Side: Company Info */}
            <div className="flex-1 flex flex-col pr-8 items-center justify-center">
                {recruiterInfo.company.id === null ? (
                    <div className="text-gray-500 italic text-lg">Not currently working with a company</div>
                ) : (
                    <>
                        <div className="flex items-center space-x-8 mb-12">
                            {!imageError && recruiterInfo.company.image ? (
                                <img
                                    src={recruiterInfo.company.image}
                                    onError={() => setImageError(true)}
                                    alt="Company Logo"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center text-gray-500">
                                    {recruiterInfo.company.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h2 className="text-gray-800 text-xl font-medium">
                                    {recruiterInfo.company.name}
                                </h2>
                            </div>
                        </div>
                        <div className="text-gray-800">
                            <span className="font-medium text-xl">Department:</span>{" "}
                            <span className="text-lg">{recruiterInfo.department}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Vertical Divider */}
            <div className="h-48 border-l border-gray-300" />

            {/* Right Side: Assigned Candidates */}
            <div className="flex-1 flex flex-col items-center justify-center pl-16">
                <div className="text-5xl font-bold text-indigo-600">
                    {recruiterInfo.assignedCandidatesCnt}
                </div>
                <div className="text-gray-800 mt-8 text-xl font-medium">Assigned Candidates</div>
            </div>
        </div>
    );
}
