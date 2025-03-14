import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { mockJobOffersOverview } from "../../mock data/jobOffers";
import { JobOfferOverviewType } from "../../types/jobOffer";
import { DashboardFilters } from "../../types/seekerDashboard";

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
        remote: false,
        country: "",
        city: "",
        status: "",
        phase: "",
        sortBy: "",
        company: "",
    },
    seekerJobOfferDialogIsOpen: false,
    seekerJobOfferDialogJobIdAndCandidateId: { jobId: 0, candidateId: 1 },
    seekerJobOfferDialogSetIsOpen: (value) => set({ seekerJobOfferDialogIsOpen: value }),
    seekerJobOfferDialogSetJobIdAndCandidateId: (jobId, candidateId) =>
        set({ seekerJobOfferDialogJobIdAndCandidateId: { jobId, candidateId } }),
    seekerJobOffersCompanyNames: [],

    seekerJobOffersFetchData: async () => {
        const {
            seekerJobOffersPage,
            seekerJobOffersHasMore,
            seekerJobOffersIsLoading,
        } = get();
        if (!seekerJobOffersHasMore || seekerJobOffersIsLoading) return;
        set({ seekerJobOffersIsLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated
        try {
            await new Promise<void>((resolve) =>
                setTimeout(() => {
                    const startIndex = (seekerJobOffersPage - 1) * 5;
                    const endIndex = startIndex + 5;
                    const newRows = mockJobOffersOverview.slice(
                        startIndex,
                        endIndex
                    );

                    set((state) => ({
                        seekerJobOffersData: [
                            ...state.seekerJobOffersData,
                            ...newRows.map((jobOffer) => ({
                                ...jobOffer,
                                dateRecieved: formatDistanceToNow(
                                    new Date(jobOffer.dateRecieved),
                                    { addSuffix: true }
                                ),
                                city: jobOffer.city,
                                country: jobOffer.country,
                            })),
                        ],
                        seekerJobOffersHasMore:
                            endIndex < mockJobOffersOverview.length,
                        seekerJobOffersIsLoading: false,
                        seekerJobOffersPage: state.seekerJobOffersPage + 1,
                    }));
                    resolve();
                }, 500)
            );
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

});
