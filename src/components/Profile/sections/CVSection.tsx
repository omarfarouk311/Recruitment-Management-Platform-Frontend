import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useStore from "../../../stores/globalStore";
import CVForm from "../forms/CVForm";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";

export default function CVSection() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const cvs = useStore.useSeekerProfileCVs();
    const removeCV = useStore.useSeekerProfileRemoveCV();
    const fetchCVs = useStore.useSeekerProfileFetchCVs();
    const userRole = useStore.useUserRole();

    useEffect(() => {
        setIsLoading(true);
        fetchCVs().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow p-6 mb-4 h-[230px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">CVs</h2>
                {userRole === "seeker" && (
                    <Button
                        variant="outline"
                        className="!w-auto !h-8 !p-3"
                        onClick={() => setIsFormOpen(true)}
                        disabled={cvs.length === 5}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        {cvs.length === 5 ? "CVs limit reached" : "Add"}
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="h-full overflow-hidden">
                    <SkeletonLoader />
                </div>
            ) : cvs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                    No CVs found
                </div>
            ) : (
                <div className="space-y-4 h-full overflow-y-auto px-2">
                    {cvs.map((cv) => (
                        <div
                            key={cv.id}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl"
                        >
                            {/* CV Name */}
                            <p className="text-black break-words max-w-[70%]">
                                {cv.name}
                            </p>

                            {/* Date and Delete Button */}
                            <div className="flex items-center gap-4 ml-auto pl-4">
                                <p className="text-sm text-gray-600 mr-2">
                                    {cv.createdAt}
                                </p>

                                {userRole === "seeker" && (
                                    <button
                                        onClick={() => removeCV(cv.id!)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {userRole === "seeker" && (
                <CVForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
