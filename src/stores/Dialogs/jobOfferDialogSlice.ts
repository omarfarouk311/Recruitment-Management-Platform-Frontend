import {
    JobOfferDetailsType,
    JobOfferTemplateListType,
} from "../../types/jobOffer";
import { CombinedState } from "../storeTypes";
import { StateCreator } from "zustand";
import { mockJobOffersDetails, mockTemplates } from "../../mock data/jobOffers";

export interface JobOfferDialogSlice {
    jobOfferDialogTemplateList: JobOfferTemplateListType[];
    jobOfferDialogData: JobOfferDetailsType | null;
    jobOfferDialogSelectedTemplateId: number | null;
    jobOfferDialogSetTemplateId: (templateId: number | null) => void;
    jobOfferDialogSetTemplateList: () => Promise<void>;
    jobOfferDialogFetchData: (
        candidateData: { jobId: number; candidateId?: number },
        templateId?: number
    ) => Promise<void>;
    jobOfferDialogUpdateData: (
        jobId: number,
        candidateId: number
    ) => Promise<void>;
    jobOfferDialogResetData: () => void;
    jobOfferDialogModifyData: (data: JobOfferDetailsType) => void;
}

export const createJobOfferDialogSlice: StateCreator<
    CombinedState,
    [],
    [],
    JobOfferDialogSlice
> = (set, get) => ({
    jobOfferDialogTemplate: null,
    jobOfferDialogData: null,
    jobOfferDialogTemplateList: [],
    jobOfferDialogSelectedTemplateId: null,
    jobOfferDialogSetTemplateList: async () => {
        const { jobOfferDialogTemplateList } = get();
        if (jobOfferDialogTemplateList.length) return;
        set({
            jobOfferDialogTemplateList: mockTemplates.map((template) => ({
                templateId: template.templateId,
                templateName: template.templateName,
            })),
        })
    },
    jobOfferDialogFetchData: async ({ jobId, candidateId }, templateId) =>
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                if (templateId) {
                    set({
                        jobOfferDialogData: {
                            ...mockTemplates[templateId],
                        },
                    });
                } else if (jobId) {
                    set({
                        jobOfferDialogData: {
                            ...mockJobOffersDetails[jobId],
                        },
                    });
                    if (mockJobOffersDetails[jobId].templateId) {
                        set({
                            jobOfferDialogSelectedTemplateId:
                                mockJobOffersDetails[jobId].templateId,
                        });
                    }
                } else {
                    set({
                        jobOfferDialogData: null,
                    });
                }
                resolve();
            }, 500);
        }),
    jobOfferDialogResetData: () =>
        set({
            jobOfferDialogSelectedTemplateId: null,
            jobOfferDialogData: null,
        }),
    jobOfferDialogUpdateData: async (jobId, candidateId) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                const { jobOfferDialogData } = get();
                if (!jobOfferDialogData) {
                    return;
                }
                mockJobOffersDetails[jobId] = {
                    ...jobOfferDialogData,
                    placeholders: {
                        ...mockJobOffersDetails[jobId].placeholders,
                        ...jobOfferDialogData.placeholders,
                    },
                };
                resolve();
            }, 500);
        });
    },
    jobOfferDialogModifyData: (data) =>
        set({
            jobOfferDialogData: data,
        }),
    
    jobOfferDialogSetTemplateId(templateId) {
        set({
            jobOfferDialogSelectedTemplateId: templateId,
        });
    },
});
