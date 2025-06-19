import {
    JobOfferDetailsType,
    JobOfferTemplateListType,
} from "../../types/jobOffer";
import { CombinedState } from "../storeTypes";
import { StateCreator } from "zustand";
import axios from "axios";
import config from "../../../config/config";
import { showErrorToast } from "../../util/errorHandler";
import { authRefreshToken } from "../../util/authUtils";

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
        let res;
        try {
            res = await axios.get(`${config.API_BASE_URL}/templates`, {
                params: {
                    simplified: true
                },
                withCredentials: true
            });
            set({
                jobOfferDialogTemplateList: res!.data.map((template: {id: number; name: string}) => ({
                    templateId: template.id,
                    templateName: template.name,
                })),
            })
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().jobOfferDialogSetTemplateList();
                    }
                }
            }
            showErrorToast("Failed to fetch templates");
        }
    },
    jobOfferDialogFetchData: async ({ jobId, candidateId }, templateId) => {
        try {
            if (templateId && !isNaN(templateId)) {
                let res = await axios.get(`${config.API_BASE_URL}/templates/template-details/${templateId}`, {
                    withCredentials: true
                });

                set({
                    jobOfferDialogData: {
                        ...res.data,
                        templateName: res.data.name,
                        templateId: templateId
                    }
                });
            } else if (jobId && !candidateId) {
                let res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers/${jobId}`, {
                    withCredentials: true
                });
                set({
                    jobOfferDialogData: {
                        description: res.data.offer,
                        placeholders: res.data.placeholdersParams,
                        templateName: "",
                        templateId: -1,
                    },
                });
            } else if (jobId && candidateId) {
                let res = await axios.get(`${config.API_BASE_URL}/templates/offer-details/job/${jobId}/seeker/${candidateId}`, {
                    withCredentials: true
                });
                set({
                    jobOfferDialogData: {
                        templateId: res.data.template_id,
                        description: res.data.template_description,
                        placeholders: res.data.placeholders_params, 
                        templateName: res.data.template_name,
                    }
                });
                
                if (res.data.template_id) {
                    set({
                        jobOfferDialogSelectedTemplateId: res.data.template_id
                    });
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().jobOfferDialogFetchData({ jobId, candidateId }, templateId);
                    }
                } 
            }
            showErrorToast("Failed to fetch job offer data");
        }
    },

    jobOfferDialogResetData: () =>
        set({
            jobOfferDialogSelectedTemplateId: null,
            jobOfferDialogData: null,
        }),


    jobOfferDialogUpdateData: async (jobId, candidateId) => {
        const { jobOfferDialogData, jobOfferDialogSelectedTemplateId } = get();
        if (!jobOfferDialogData) {
            return;
        }
        try {
            await axios.post(`${config.API_BASE_URL}/templates/offer-details/job/${jobId}/seeker/${candidateId}`, {
                templateId: jobOfferDialogSelectedTemplateId,
                placeholders: jobOfferDialogData?.placeholders,
            }, {
                withCredentials: true
            });
        } catch (err) {
            if(axios.isAxiosError(err)) {
                if(err.response?.status === 400) {
                    if (Array.isArray(err.response.data.validationErrors)) {
                        err.response.data.validationErrors.forEach((msg: string) => showErrorToast(msg));
                    }
                    return;
                }
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().jobOfferDialogUpdateData(jobId, candidateId);
                    }
                }
            }
            showErrorToast("Failed to update job offer data");
            throw err;
        }
    },


    jobOfferDialogModifyData: (data) =>
        set({
            jobOfferDialogData: data,
        }),
    
    jobOfferDialogSetTemplateId: (templateId) => {
        console.log("template", templateId);
        if (templateId === null || typeof templateId !== "number" || isNaN(templateId)) {
            get().jobOfferDialogResetData();
            return;
        }
        set({
            jobOfferDialogSelectedTemplateId: templateId,
        });
    },
});
