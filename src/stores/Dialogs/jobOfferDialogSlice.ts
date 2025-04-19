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
    jobOfferDialogValidationErrors: string[]; 
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
    jobOfferDialogValidationErrors: [],
    jobOfferDialogSetTemplateList: async () => {
        const { jobOfferDialogTemplateList } = get();
        if (jobOfferDialogTemplateList.length) return;
        let res;
        try {
            try {
                res = await axios.get(`${config.API_BASE_URL}/templates`, {
                    params: {
                        simplified: true
                    }
                });
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    if(err.response?.status === 401) {
                        authRefreshToken();
                    }
                }
            }
            if(!res) {
                res = await axios.get(`${config.API_BASE_URL}/templates`, {
                    params: {
                        simplified: true
                    }
                });
            }
            set({
                jobOfferDialogTemplateList: res!.data.map((template: {id: number; name: string}) => ({
                    templateId: template.id,
                    templateName: template.name,
                })),
            })
        } catch (err) {
            showErrorToast("Failed to fetch templates");
        }
    },
    jobOfferDialogFetchData: async ({ jobId, candidateId }, templateId) => {
        try {
            if (templateId) {
                let res
                try {
                    res = await axios.get(`${config.API_BASE_URL}/templates/template-details/${templateId}`);
                } catch (err) {
                    if(axios.isAxiosError(err)) {
                        if(err.response?.status === 401) {
                            authRefreshToken();
                        }
                    }
                }
                if(!res) {
                    res = await axios.get(`${config.API_BASE_URL}/templates/template-details/${templateId}`);
                }

                set({
                    jobOfferDialogData: {
                        ...res.data,
                        templateName: res.data.name,
                        templateId: templateId
                    }
                });
            } else if (jobId && !candidateId) {
                let res 
                try {
                    res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers/${jobId}`);
                } catch (err) {
                    if(axios.isAxiosError(err)) {
                        if(err.response?.status === 401) {
                            authRefreshToken();
                        }
                    }
                }
                if(!res) {
                    res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers/${jobId}`);
                }
                if(res.status !== 200) {
                    throw new Error("Failed to fetch job offer data");
                }
                set({
                    jobOfferDialogData: {
                        description: res.data.offer,
                        placeholders: res.data.placeholdersParams,
                        templateName: "",
                        templateId: -1,
                    },
                });
                
            } else if (jobId && candidateId) {
                let res 
                try {
                    res = await axios.get(`${config.API_BASE_URL}/templates/offer-details/job/${jobId}/seeker/${candidateId}`)
                } catch (err) {
                    if(axios.isAxiosError(err)) {
                        if(err.response?.status === 401) {
                            authRefreshToken();
                        }
                    }
                }
                if(!res) {
                    res = await axios.get(`${config.API_BASE_URL}/templates/offer-details/job/${jobId}/seeker/${candidateId}`)
                }
                
                if(res.status !== 200) {
                    throw new Error("Failed to fetch job offer data");
                }
                set({
                    jobOfferDialogData: {
                        templateId: res.data.template_id,
                        description: res.data.template_description,
                        placeholders: res.data.placeholders_params, 
                        templateName: res.data.template_name,
                    },
                });
                if (res.data.template_id) {
                    set({
                        jobOfferDialogSelectedTemplateId: res.data.template_id
                    });
                }
            }
        } catch (err) {
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
            let res = await axios.post(`${config.API_BASE_URL}/templates/offer-details/job/${jobId}/seeker/${candidateId}`, {
                templateId: jobOfferDialogSelectedTemplateId,
                placeholders: jobOfferDialogData?.placeholders,
            });
            if(res.status === 400) {
                set({
                    jobOfferDialogValidationErrors: res.data.validationErrors,
                });
                return;
            }
        } catch (err) {
            if(axios.isAxiosError(err)) {
                if(err.response?.status === 400) {
                    set({
                        jobOfferDialogValidationErrors: err.response.data.validationErrors,
                    });
                }
            }
        }
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
