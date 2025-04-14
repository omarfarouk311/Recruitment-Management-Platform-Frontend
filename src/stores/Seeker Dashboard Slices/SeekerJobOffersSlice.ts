import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { mockJobOffersOverview } from "../../mock data/jobOffers";
import { JobOfferOverviewType } from "../../types/jobOffer";
import { SeekerJobOffersDashboardFilter } from "../../types/seekerDashboard";
import axios from "axios";
import config from "../../../config/config.ts";

export enum JobOfferDecision{
    Rejected = 0,
    Accepted = 1
}

export interface SeekerJobOffersSlice {
    seekerJobOffersData: JobOfferOverviewType[];
    seekerJobOffersPage: number;
    seekerJobOffersHasMore: boolean;
    seekerJobOffersIsLoading: boolean;
    seekerJobOffersFilters: SeekerJobOffersDashboardFilter;
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
        phase: "",
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

        // mock API call, don't forget to include the filters in the query string if they are populated
        try {
            const params = Object.fromEntries(
                Object.entries({
                    country: country,
                    city: city,
                    status: status,
                    page: seekerJobOffersPage,
                    sort: sortBy? (Math.abs(parseInt(sortBy)) === 2 ? parseInt(sortBy) / 2 : parseInt(sortBy)): undefined,
                    companyId: company? parseInt(company): undefined
                }).filter(([_, value]) => value !== undefined && value !== null && value !== "")
            );

            let res = await axios.get(`${config.API_BASE_URL}/seekers/job-offers`, { params });
            if (res.status !== 200) {
                throw new Error("Error fetching data");
            }
            set((state) => ({
                seekerJobOffersData: [
                    ...state.seekerJobOffersData,
                    ...res.data.map((jobOffer: JobOfferOverviewType) => ({
                        ...jobOffer,
                        dateRecieved: formatDistanceToNow(
                            new Date(jobOffer.dateRecieved),
                            { addSuffix: true }
                        ),
                        city: jobOffer.city,
                        country: jobOffer.country,
                        status: jobOffer.status === '1'? "Accepted": jobOffer.status === '0'? "Rejected": "Pending",
                    })),
                ],
                seekerJobOffersHasMore: res.data.length > 0,
                seekerJobOffersIsLoading: false,
                seekerJobOffersPage: state.seekerJobOffersPage + 1,
            }));
        } catch (err) {
            set({ seekerJobOffersIsLoading: false });
        }
    },

    seekerJobOffersSetCompanyNames: async () => {
        set({
            seekerJobOffersCompanyNames: [
                { value: "", label: "Any" },
                ...mockJobOffersOverview.map(({ companyName }) => ({
                    value: companyName,
                    label: companyName,
                })),
            ],
        });
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
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                mockJobOffersOverview[jobId].status = JobOfferDecision[decision];
                set((prev) => ({
                    seekerJobOffersData: prev.seekerJobOffersData.map(value => {
                        if (jobId === value.jobId) {
                            return {
                                ...value,
                                status: JobOfferDecision[decision]
                            };
                        }
                        return value;
                    })
                }));
                resolve();
            }, 500);
        });
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
