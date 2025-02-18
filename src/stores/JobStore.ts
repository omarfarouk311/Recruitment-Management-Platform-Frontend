import { create } from 'zustand';
import { baseJobs } from "../mock data/jobs";
import { createSelectorHooks } from "auto-zustand-selectors-hook";

interface Job {
    company: string;
    rating: number;
    position: string;
    location: string;
    datePosted: string;
    industry: string;
}

interface JobStore {
    jobs: Job[];
    page: number; // Track the current page
    filters: {
        date: string;
        rating: string;
        industry: string;
        remoteOnly: boolean;
    };
    searchCriteria: {
        jobQuery: string;
        country: string;
        city: string;
        companyQuery: string;
    };
    isLoading: boolean;
    hasMore: boolean;
    selectedJobIndex: number | null;
    isDetailsLoading: boolean;
    fetchJobs: () => Promise<void>;
    setFilters: (filters: Partial<JobStore['filters']>) => Promise<void>;
    setSearchCriteria: (criteria: Partial<JobStore['searchCriteria']>) => void;
    applySearch: () => Promise<void>;
    setSelectedJobIndex: (index: number) => void;
    setIsDetailsLoading: (loading: boolean) => void;
}

const useJobStoreBase = create<JobStore>((set, get) => ({
    jobs: [],
    page: 1, // Start with page 1
    filters: {
        date: 'any',
        rating: 'any',
        industry: 'any',
        remoteOnly: false,
    },
    searchCriteria: {
        jobQuery: '',
        country: '',
        city: '',
        companyQuery: '',
    },
    isLoading: false,
    hasMore: true,
    selectedJobIndex: null,
    isDetailsLoading: false,

    fetchJobs: async () => {
        const { filters, searchCriteria, page, hasMore, isLoading } = get();
        if (!hasMore || isLoading) return;
        set({ isLoading: true });

        try {
            // Simulate an async API call
            await new Promise<void>((resolve) => setTimeout(() => {
                // Calculate the start and end indices for the current page
                const startIndex = (page - 1) * 5; // 5 jobs per page
                const endIndex = startIndex + 5;

                // Get the jobs for the current page
                const newJobs = baseJobs.slice(startIndex, endIndex);

                // Update the state
                set((state) => ({
                    jobs: [...state.jobs, ...newJobs],
                    hasMore: endIndex < baseJobs.length, // Check if there are more jobs to load
                    isLoading: false,
                    page: state.page + 1, // Increment the page
                }));
                resolve();
            }, 500));
        } catch (err) {
            set({ isLoading: false });
        }
    },

    setFilters: async (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
            jobs: [],
            page: 1,
            selectedJobIndex: null,
            isLoading: false,
            hasMore: true,
            isDetailsLoading: false,
        }));
        const { fetchJobs } = get();
        await fetchJobs();
    },

    setSearchCriteria: (criteria) => {
        set((state) => ({
            searchCriteria: { ...state.searchCriteria, ...criteria },
        }));
    },

    applySearch: async () => {
        set({
            jobs: [],
            page: 1,
            selectedJobIndex: null,
            isLoading: false,
            hasMore: true,
            isDetailsLoading: false,
        });
        const { fetchJobs } = get();
        await fetchJobs();
    },
    setSelectedJobIndex: (index: number) => {
        set({ selectedJobIndex: index });
    },

    setIsDetailsLoading: (loading: boolean) => {
        set({ isDetailsLoading: loading });
    },
}));

export default createSelectorHooks(useJobStoreBase);