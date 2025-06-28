import { useEffect, useState } from "react";
import useStore from "../../stores/globalStore";
import { Dialog, DialogTitle } from "@headlessui/react";
import SkeletonLoader from "./SkeletonLoader";
import Button from "./Button";
import { UserRole } from "../../stores/User Slices/userSlice";
import { showErrorToast } from "../../util/errorHandler";

interface JobOfferDialogProps {
    useIsOpen: () => boolean;
    useSetIsOpen: (value: boolean) => void;
    useSelectedJobIdAndCandidateId: () => {
        jobId: number;
        candidateId?: number;
    };
    isEditing?: boolean;
}

const JobOfferDialog = ({
    useIsOpen,
    useSetIsOpen,
    useSelectedJobIdAndCandidateId,
    isEditing = false
}: JobOfferDialogProps) => {
    const offerData = useStore.useJobOfferDialogData();
    const useSetOfferData = useStore.useJobOfferDialogFetchData();
    const useModifyOfferData = useStore.useJobOfferDialogModifyData();
    const useSetJobOfferTemplateList =
        useStore.useJobOfferDialogSetTemplateList();
    const templateList = useStore.useJobOfferDialogTemplateList();
    const [useIsLoadingTemplateList, setUseIsLoadingTemplateList] = useState(false);
    const [useIsLoadingOfferData, setUseIsLoadingOfferData] = useState(false);
    const reset = useStore.useJobOfferDialogResetData();
    const isOpen = useIsOpen();
    const { jobId, candidateId } = useSelectedJobIdAndCandidateId();
    const useUpdateOfferData = useStore.useJobOfferDialogUpdateData();
    const [useSelectedTemplate, useSetSelectedTemplate] = [useStore.useJobOfferDialogSelectedTemplateId(), useStore.useJobOfferDialogSetTemplateId()];
    const [useIsLoadingSubmit, setUseIsLoadingSubmit] = useState(false);
    const userRole = useStore.useUserRole();
    
    const onClose = () => {
        if(useSelectedTemplate) {
            reset();
            useSetSelectedTemplate(null);
        }
        useSetIsOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(!useSelectedTemplate) {
                showErrorToast("Please select a template");
                return;
            }
            if (candidateId) {
                setUseIsLoadingSubmit(true);
                await useUpdateOfferData(jobId, candidateId);
                setUseIsLoadingSubmit(false);
            }
            onClose();
            window.location.reload();
        } catch (err) {
            setUseIsLoadingSubmit(false);
            console.error("Error submitting offer:", err);
        }
    };

    if (
        offerData &&
        offerData.placeholders &&
        Array.isArray(offerData.placeholders)
    ) {
        offerData.placeholders = offerData.placeholders.reduce(
            (acc, curr) => ({ ...acc, [`${curr}`]: "" }),
            {}
        );
    }

    const useSetOfferDetails = async (templateId?: number) => {
        try {
            setUseIsLoadingOfferData(true);
            await useSetOfferData({ jobId, candidateId }, templateId);
            setUseIsLoadingOfferData(false);
        } catch (error) {
            setUseIsLoadingOfferData(false);
        }
    };

    const useSetTemplateList = async () => {
        try {
            setUseIsLoadingTemplateList(true);
            await useSetJobOfferTemplateList();
            setUseIsLoadingTemplateList(false);
        } catch (error) {
            setUseIsLoadingTemplateList(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                if(candidateId)
                    await useSetTemplateList();
                if (!isEditing && userRole != UserRole.SEEKER) return;
                const oldIsEditing = isEditing;
                isEditing = false;
                await useSetOfferDetails();
                isEditing = oldIsEditing;
            };
            loadData();
        }
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-10 overflow-y-auto"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl mx-auto">
                    <DialogTitle className="text-2xl font-bold mb-6">
                        Job Offer
                    </DialogTitle>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {candidateId && (useIsLoadingTemplateList ? (
                                <div className="max-h-[90px] overflow-y-hidden">
                                    <SkeletonLoader />
                                </div>
                            ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Template
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={useSelectedTemplate ?? ""}
                                            onChange={async (e) => {
                                                useSetSelectedTemplate(parseInt(e.target.value));
                                                await useSetOfferDetails(parseInt(e.target.value));
                                            }}
                                        >
                                            <option value={-1}>
                                                Choose Template
                                            </option>
                                            {templateList.map((t) => (
                                                <option
                                                    key={t.templateId}
                                                    value={t.templateId}
                                                >
                                                    {t.templateName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            )}
                            {useIsLoadingOfferData? (
                                <div className="max-h-[350px] overflow-y-hidden">
                                    <SkeletonLoader />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {candidateId ? "Template content" : "Offer"}
                                        </label>
                                        <div className="w-full p-4 bg-gray-50 rounded-2xl min-h-[120px] whitespace-pre-wrap break-words">
                                            {offerData?.description ?? "Select a template to view the offer details."}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {offerData?.placeholders &&
                                            Object.entries(offerData.placeholders).map(
                                                ([key, value]) => (
                                                    <div key={key}>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {key}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            disabled={!candidateId}
                                                            onChange={(e) => {
                                                                useModifyOfferData({
                                                                  ...offerData,
                                                                  placeholders: {
                                                                    ...offerData.placeholders,
                                                                    [key]: e.target.value
                                                                  }
                                                                });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            {candidateId && (
                                <Button
                                    variant="report"
                                    onClick={() => {
                                        reset();
                                        onClose();
                                    }}
                                    className="w-[25%]"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className="w-[25%]"
                                loading={useIsLoadingOfferData || useIsLoadingTemplateList || useIsLoadingSubmit}
                            >
                                {candidateId ? "Send" : "Close"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default JobOfferDialog;
