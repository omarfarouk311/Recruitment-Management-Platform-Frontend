import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useStore from "../../../stores/globalStore";
import CVForm from "../forms/CVForm";
import SkeletonLoader from "../../common/SkeletonLoader";
import Button from "../../common/Button";
import { toast } from "react-toastify";
import { UserRole } from "../../../stores/User Slices/userSlice";

export default function CVSection() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const cvs = useStore.useSeekerProfileCVs();
    const removeCV = useStore.useSeekerProfileRemoveCV();
    const fetchCVs = useStore.useSeekerProfileFetchCVs();
    const getCV = useStore.useSeekerProfileGetCV();
    const userRole = useStore.useUserRole();

    useEffect(() => {
        setIsLoading(true);
        fetchCVs().then(() => {
            setIsLoading(false);
        });
    }, []);

    const handleCVClick = async (cvId: number, cvName: string) => {
        try {
            const response = await getCV(cvId);
            if (!response) {
                toast.error("CV not found");
                return;
            }

            // Create Blob from ArrayBuffer
            const blob = new Blob([response], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            // Try to open in new window with PDF viewer
            const pdfWindow = window.open(url, "_blank");
            if (
                !pdfWindow ||
                pdfWindow.closed ||
                typeof pdfWindow.closed === "undefined"
            ) {
                // Fallback to download if popup blocked
                const link = document.createElement("a");
                link.href = url;
                link.download = cvName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // Clean up after 1 minute
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            toast.error("Failed to load CV");
            console.error("Error handling CV:", error);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow p-6 mb-4 h-[230px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">CVs</h2>
                {userRole === UserRole.SEEKER && (
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
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl cursor-pointer hover:bg-gray-200"
                            onClick={() => handleCVClick(cv.id!, cv.name)}
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

                                {userRole === UserRole.SEEKER && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCV(cv.id!);
                                        }}
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

            {userRole === UserRole.SEEKER && (
                <CVForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
