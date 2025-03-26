import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useStore from "../../../stores/globalStore";
import CVForm from "../forms/CVForm";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";
import { formatDistanceToNow } from "date-fns";

export default function CVSection() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const cvs = useStore.useSeekerProfileCVs();
    const removeCV = useStore.useSeekerProfileRemoveCV();
    const fetchCVs = useStore.useSeekerProfileFetchCVs();

    useEffect(() => {
        setIsLoading(true);
        fetchCVs().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">CVs</h2>
                <Button
                    variant="outline"
                    className="!w-auto !h-8 !p-3"
                    onClick={() => setIsFormOpen(true)}
                    disabled={cvs.length === 5 ? true : false}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    {cvs.length === 5 ? "Cvs limit reached" : "Add"}
                </Button>
            </div>

            {isLoading ? (
                <div className="h-[134px] overflow-hidden">
                    <SkeletonLoader />
                </div>
            ) : cvs.length === 0 ? (
                <div className="h-[134px] flex items-center justify-center text-gray-500">
                    No CVs found
                </div>
            ) : (
                <div className="space-y-4 h-[134px] overflow-y-auto px-2">
                    {cvs.map((cv) => (
                        <div
                            key={cv.id}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl"
                        >
                            <div className="flex items-center">
                                <p className="text-black break-words">
                                    {cv.name}
                                </p>
                                <p className="ml-10 text-sm text-gray-600">
                                    {cv.createdAt}
                                </p>
                            </div>

                            <button
                                onClick={() => removeCV(cv.id!)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <CVForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
    );
}
