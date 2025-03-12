import { StateCreator } from 'zustand';
import { Job, ForYouTabFilters, JobDetails } from '../../types/job';
import { mockDetailedJobs, mockJobs } from "../../mock data/seekerForYou";
import { CombinedState } from '../storeTypes';
import { mockIndustries } from '../../mock data/seekerForYou';
import config from "../../../config/config";
import { HomePageTabs } from './homePageSlice';
import { formatDistanceToNow } from 'date-fns';

const { paginationLimit } = config;

export interface ForYouTabSlice {
    forYouTabJobs: Job[];
    forYouTabDetailedJobs: JobDetails[];
    forYouTabPage: number;
    forYouTabHasMore: boolean;
    forYouTabIsJobsLoading: boolean;
    forYouTabSelectedJobId: number | null;
    forYouTabIsDetailsLoading: boolean;
    forYouTabFilters: ForYouTabFilters;
    forYouTabSearchQuery: string;
    forYouTabIndustryOptions: { value: string, label: string }[];
    forYouTabFetchJobs: () => Promise<void>;
    forYouTabSetSelectedJobId: (id: number) => Promise<void>;
    forYouTabSetFilters: (filters: Partial<ForYouTabSlice['forYouTabFilters']>) => Promise<void>;
    forYouTabSetSearchQuery: (query: string) => void;
    forYouTabApplySearch: () => Promise<void>;
    forYouTabSetIndustryOptions: () => Promise<void>;
    forYouTabPushToDetailedJobs: (id: number) => Promise<void>;
    forYouTabPopFromDetailedJobs: () => void;
}

export const createForYouTabSlice: StateCreator<CombinedState, [], [], ForYouTabSlice> = (set, get) => ({
    forYouTabJobs: [],
    forYouTabDetailedJobs: [],
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
        const { forYouTabHasMore, forYouTabIsJobsLoading } = get();
        if (!forYouTabHasMore || forYouTabIsJobsLoading) return;
        set({ forYouTabIsJobsLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => {
                    const startIndex = (state.forYouTabPage - 1) * paginationLimit;
                    const endIndex = startIndex + paginationLimit;
                    const newJobs = mockJobs.slice(startIndex, endIndex).map((job) => ({
                        ...job,
                        datePosted: formatDistanceToNow(new Date(job.datePosted), { addSuffix: true })
                    }));

                    return {
                        forYouTabJobs: [...state.forYouTabJobs, ...newJobs],
                        forYouTabHasMore: endIndex < mockJobs.length,
                        forYouTabIsJobsLoading: false,
                        forYouTabPage: state.forYouTabPage + 1,
                    }
                });
                resolve();
            }, 500));
        }
        catch (err) {
            set({ forYouTabIsJobsLoading: false });
        }
    },

    forYouTabSetSelectedJobId: async (id: number) => {
        if (id === get().forYouTabSelectedJobId) return;
        set({ forYouTabIsDetailsLoading: true, forYouTabSelectedJobId: id });

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const detailedJob = { ...mockDetailedJobs[id] };
                detailedJob.datePosted = formatDistanceToNow(new Date(detailedJob.datePosted), { addSuffix: true });
                detailedJob.similarJobs = detailedJob.similarJobs.map((job) => ({
                    ...job, datePosted: formatDistanceToNow(new Date(job.datePosted), { addSuffix: true })
                }));

                set({
                    forYouTabDetailedJobs: [detailedJob],
                    forYouTabIsDetailsLoading: false
                });
                resolve();
            }, 500));
        }
        catch (err) {
            set({ forYouTabIsDetailsLoading: false });
        }
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
            forYouTabDetailedJobs: [],
            forYouTabIsJobsLoading: false,
            forYouTabHasMore: true,
            forYouTabIsDetailsLoading: false,
            homePageActiveTab: HomePageTabs.JobSearch
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
            set({ companiesTabIndustryOptions: [] });
        }
    },

    forYouTabPushToDetailedJobs: async (id: number) => {
        set({ forYouTabIsDetailsLoading: true });

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const detailedJob = { ...mockDetailedJobs[id] };
                detailedJob.datePosted = formatDistanceToNow(new Date(detailedJob.datePosted), { addSuffix: true });
                detailedJob.similarJobs = detailedJob.similarJobs.map((job) => ({
                    ...job, datePosted: formatDistanceToNow(new Date(job.datePosted), { addSuffix: true })
                }));

                set((state) => ({
                    forYouTabDetailedJobs: [
                        detailedJob,
                        ...state.forYouTabDetailedJobs
                    ],
                    forYouTabIsDetailsLoading: false
                }));
                resolve();
            }, 500));
        }
        catch (err) {
            set({ forYouTabIsDetailsLoading: false });
        }
    },

    forYouTabPopFromDetailedJobs: () => {
        set((state) => {
            const newJobs = [...state.forYouTabDetailedJobs];
            newJobs.shift();
            return {
                forYouTabDetailedJobs: newJobs,
                forYouTabIsDetailsLoading: false
            }
        });
    }

});