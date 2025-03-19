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
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </div>

            {isLoading ? (
                <div className="h-[135px] overflow-hidden">
                    <SkeletonLoader />
                </div>
            ) : (
                <div className="space-y-4 max-h-[135px] overflow-y-auto">
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
                                    {formatDistanceToNow(
                                        new Date(cv.createdAt),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
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
