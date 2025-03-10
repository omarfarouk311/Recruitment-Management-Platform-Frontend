import { StateCreator } from 'zustand';
import { Job, ForYouTabFilters, JobDetails } from '../../types/job';
import { mockDetailedJobs, mockJobs } from "../../mock data/seekerForYou";
import { CombinedState } from '../storeTypes';
import { mockIndustries } from '../../mock data/seekerForYou';
import config from "../../../config/config";

const { paginationLimit } = config;

export interface ForYouTabSlice {
    forYouTabJobs: Job[];
    forYouTabDetailedJob: JobDetails | null;
    forYouTabPage: number;
    forYouTabHasMore: boolean;
    forYouTabIsJobsLoading: boolean;
    forYouTabSelectedJobId: number | null;
    forYouTabIsDetailsLoading: boolean;
    forYouTabFilters: ForYouTabFilters;
    forYouTabSearchQuery: string;
    forYouTabIndustryOptions: { value: string, label: string }[];
    forYouTabFetchJobs: () => Promise<void>;
    forYouTabSetSelectedJobId: (id: number) => void;
    forYouTabSetFilters: (filters: Partial<ForYouTabSlice['forYouTabFilters']>) => Promise<void>;
    forYouTabSetSearchQuery: (query: string) => void;
    forYouTabApplySearch: () => Promise<void>;
    forYouTabSetIndustryOptions: () => Promise<void>;
}

export const createForYouTabSlice: StateCreator<CombinedState, [], [], ForYouTabSlice> = (set, get) => ({
    forYouTabJobs: [],
    forYouTabDetailedJob: null,
    forYouTabPage: 1,
    forYouTabHasMore: true,
    forYouTabIsJobsLoading: false,
    forYouTabSelectedJobId: null,
    forYouTabIsDetailsLoading: false,
    forYouTabFilters: {
        datePosted: '',
        companyRating: '',
        industry: '',
        country: '',
        city: '',
        remote: false
    },
    forYouTabSearchQuery: '',
    forYouTabIndustryOptions: [],

    forYouTabFetchJobs: async () => {
        const { forYouTabPage, forYouTabHasMore, forYouTabIsJobsLoading } = get();
        if (!forYouTabHasMore || forYouTabIsJobsLoading) return;
        set({ forYouTabIsJobsLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const startIndex = (forYouTabPage - 1) * paginationLimit;
                const endIndex = startIndex + paginationLimit;
                const newJobs = mockJobs.slice(startIndex, endIndex);

                set((state) => ({
                    forYouTabJobs: [...state.forYouTabJobs, ...newJobs],
                    forYouTabHasMore: endIndex < mockJobs.length,
                    forYouTabIsJobsLoading: false,
                    forYouTabPage: state.forYouTabPage + 1,
                }));
                resolve();
            }, 500));
        }
        catch (err) {
            set({ forYouTabIsJobsLoading: false });
        }
    },

    forYouTabSetSelectedJobId: (id: number) => {
        // mock API call
        set({ forYouTabIsDetailsLoading: true, forYouTabSelectedJobId: id });

        setTimeout(() => {
            set({

                forYouTabDetailedJob: mockDetailedJobs[id],
                forYouTabIsDetailsLoading: false
            });
        }, 1000);
    },

    forYouTabSetFilters: async (filters) => {
        set((state) => ({
            forYouTabFilters: { ...state.forYouTabFilters, ...filters },
            forYouTabJobs: [],
            forYouTabDetailedJob: null,
            forYouTabPage: 1,
            forYouTabSelectedJobId: null,
            forYouTabIsJobsLoading: false,
            forYouTabHasMore: true,
            forYouTabIsDetailsLoading: false,
        }));

        await get().forYouTabFetchJobs();
    },

    forYouTabSetSearchQuery: (query: string) => {
        set({ forYouTabSearchQuery: query });
    },

    forYouTabApplySearch: async () => {
        const { forYouTabSearchQuery } = get();
        if (!forYouTabSearchQuery) return;

        set({
            forYouTabJobs: [],
            forYouTabPage: 1,
            forYouTabSelectedJobId: null,
            forYouTabDetailedJob: null,
            forYouTabIsJobsLoading: false,
            forYouTabHasMore: true,
            forYouTabIsDetailsLoading: false,
            homePageActiveTab: null
        });

        await get().forYouTabFetchJobs();
    },

    forYouTabSetIndustryOptions: async () => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const newIndustries = mockIndustries;

                set({
                    forYouTabIndustryOptions: [
                        { value: "", label: "Any" },
                        ...newIndustries.map(({ value, label }) => ({ value: value.toString(), label }))
                    ]
                });

                resolve();
            }, 500));
        }
        catch (err) {
            set({ forYouTabIndustryOptions: [] });
        }
    }
});