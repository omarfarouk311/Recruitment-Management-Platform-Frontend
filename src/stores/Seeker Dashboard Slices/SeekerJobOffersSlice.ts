import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { JobOfferOverviewType } from "../../types/jobOffer";
import { DashboardFilters } from "../../types/seekerDashboard";
import axios from "axios";
import config from "../../../config/config.ts";
import { authRefreshToken } from "../../util/authUtils.ts";
import { showErrorToast } from "../../util/errorHandler.ts";

export enum JobOfferDecision{
    Rejected = 0,
    Accepted = 1
}

export interface SeekerJobOffersSlice {
    seekerJobOffersData: JobOfferOverviewType[];
    seekerJobOffersPage: number;
    seekerJobOffersHasMore: boolean;
    seekerJobOffersIsLoading: boolean;
    seekerJobOffersFilters: DashboardFilters;
    seekerJobOffersCompanyNames: { value: string; label: string }[];
    seekerJobOfferDialogIsOpen: boolean;
    seekerJobOfferDialogJobIdAndCandidateId: { jobId: number; candidateId?: number };
    seekerJobOffersFetchData: () => Promise<void>;
    seekerJobOffersSetFilters: (
        filters: Partial<SeekerJobOffersSlice["seekerJobOffersFilters"]>
    ) => Promise<void>;
    seekerJobOffersSetCompanyNames: () => Promise<void>;
    seekerJobOfferDialogSetIsOpen: (value: boolean) => void;
    seekerJobOfferDialogSetJobIdAndCandidateId: (
        jobId: number,
        candidateId?: number
    ) => void;
    seekerJobOfferMakeDecision: (jobId: number, decision: number) => Promise<void>;
    clearSeekerJobOffers: () => void;
}

export const createSeekerJobOffersSlice: StateCreator<
    CombinedState,
    [],
    [],
    SeekerJobOffersSlice
> = (set, get, _api) => ({
    seekerJobOffersData: [],
    seekerJobOffersPage: 1,
    seekerJobOffersHasMore: true,
    seekerJobOffersIsLoading: false,
    seekerJobOffersFilters: {
        country: "",
        city: "",
        status: "",
        sortBy: "",
        company: "",
    },
    seekerJobOfferDialogIsOpen: false,
    seekerJobOfferDialogJobIdAndCandidateId: { jobId: 0, candidateId: 1 },
    seekerJobOffersCompanyNames: [],


    seekerJobOfferDialogSetIsOpen: (value) => set({ seekerJobOfferDialogIsOpen: value }),
    seekerJobOfferDialogSetJobIdAndCandidateId: (jobId, candidateId) =>
        set({ seekerJobOfferDialogJobIdAndCandidateId: { jobId, candidateId } }),

    seekerJobOffersFetchData: async () => {
        const {
            seekerJobOffersPage,
            seekerJobOffersHasMore,
            seekerJobOffersIsLoading,
            seekerJobOffersFilters: { country, city, status, sortBy, company },
        } = get();
        if (!seekerJobOffersHasMore || seekerJobOffersIsLoading) return;
        set({ seekerJobOffersIsLoading: true });

        try {
            const params = Object.fromEntries(
                Object.entries({
                    country: country,
                    city: city,
                    status: status === '1'? 2 : status === '0'? 3 : 1,
                    page: seekerJobOffersPage,
                    sort: sortBy? (Math.abs(parseInt(sortBy)) === 2 ? parseInt(sortBy) / 2 : parseInt(sortBy)): undefined,
                    companyId: company? parseInt(company): undefined
                }).filter(([_, value]) => value !== undefined && value !== null && value !== "")
            );

            let res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers`, { 
                params,
                withCredentials: true,
            });
            set((state) => ({
                seekerJobOffersData: [
                    ...state.seekerJobOffersData,
                    ...res.data.map((jobOffer: JobOfferOverviewType) => ({
                        ...jobOffer,
                        dateRecieved: new Date(jobOffer.dateRecieved),
                        city: jobOffer.city,
                        country: jobOffer.country,
                    })),
                ],
                seekerJobOffersHasMore: res.data.length === config.paginationLimit,
                seekerJobOffersPage: state.seekerJobOffersPage + 1,
            }));
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerJobOffersFetchData();
                }
            }
            showErrorToast("Error fetching job offers");
        } finally {
            set({ seekerJobOffersIsLoading: false });
        }
    },

    seekerJobOffersSetCompanyNames: async () => {
        const { status } = get().seekerJobOffersFilters;
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers/company-names/`, { 
                params: status? {status: status}: {},
                withCredentials: true,
            });
            
            if (res.status !== 200) {
                throw new Error("Error fetching data");
            }

            set({
                seekerJobOffersCompanyNames: [
                    ...res.data.map((company: {companyId: number; companyName: string}) => ({
                        value: company.companyId,
                        label: company.companyName,
                    })),
                ],
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerJobOffersSetCompanyNames();
                }
            }
            showErrorToast("Error fetching company names");
        }
    },

    seekerJobOffersSetFilters: async (filters) => {
        set((state) => ({
            seekerJobOffersFilters: {
                ...state.seekerJobOffersFilters,
                ...filters,
            },
            seekerJobOffersData: [],
            seekerJobOffersPage: 1,
            seekerJobOffersHasMore: true,
        }));

        await get().seekerJobOffersFetchData();
    },

    seekerJobOfferMakeDecision: async (jobId, decision) => {
        try {
            await axios.patch(`${config.API_BASE_URL}/seekers/job-offers/reply/${jobId}`, { status: decision }, {
                withCredentials: true,
            });
            set((prev) => ({
                seekerJobOffersData: prev.seekerJobOffersData.filter(value => {
                    if (jobId === value.jobId) {
                        return false;
                    }
                    return true;
                })
            }));
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerJobOfferMakeDecision(jobId, decision);
                }
            }
            showErrorToast("Error making decision on job offer");
        }
    },

    clearSeekerJobOffers: () => {
        set({
            seekerJobOffersData: [],
            seekerJobOffersPage: 1,
            seekerJobOffersHasMore: true,
            seekerJobOffersIsLoading: false,
            seekerJobOffersFilters: {
                country: "",
                city: "",
                status: "",
                sortBy: "",
                company: "",
            },
            seekerJobOfferDialogIsOpen: false,
            seekerJobOfferDialogJobIdAndCandidateId: { jobId: 0, candidateId: 1 },
            seekerJobOffersCompanyNames: [],
        })
    }
});
