import { create } from 'zustand';
import { baseJobs } from "../mock data/jobs";

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
    filters: {
        date: string;
        rating: string;
        industry: string;
        remoteOnly: boolean
    };
    searchCriteria: {
        jobQuery: string;
        country: string;
        city: string;
        companyQuery: string;
    };
    isLoading: boolean;
    hasMore: boolean;
    fetchJobs: () => Promise<void>;
    setFilters: (filters: Partial<JobStore['filters']>) => Promise<void>;
    setSearchCriteria: (criteria: Partial<JobStore['searchCriteria']>) => void;
    loadMoreJobs: () => Promise<void>;
    applySearch: () => Promise<void>;
}

const NUMBER_OF_JOBS = 5;

const useJobStore = create<JobStore>((set, get) => ({
    jobs: baseJobs,
    filters: {
        date: 'any',
        rating: 'any',
        industry: 'any',
        remoteOnly: false
    },
    searchCriteria: {
        jobQuery: '',
        country: '',
        city: '',
        companyQuery: '',
    },
    isLoading: false,
    hasMore: baseJobs.length >= NUMBER_OF_JOBS,

    fetchJobs: async () => {
        const { filters, searchCriteria } = get();
        set({ isLoading: true });
        try {
            // Simulate an async API call
            await new Promise<void>(resolve => setTimeout(() => {
                // Apply filters and search criteria here (currently mocked)
                const result = baseJobs;
                filters;
                searchCriteria;
                ///
                set({
                    jobs: result,
                    hasMore: result.length >= NUMBER_OF_JOBS,
                    isLoading: false,
                });
                resolve();
            }, 500));
        } catch (err) {
            set({ isLoading: false });
        }
    },

    setFilters: async (filters) => {
        set(state => ({
            filters: { ...state.filters, ...filters },
        }));
        const { fetchJobs } = get();
        await fetchJobs();
    },

    setSearchCriteria: (criteria) => {
        set(state => ({ searchCriteria: { ...state.searchCriteria, ...criteria } }));
    },

    applySearch: async () => {
        const { fetchJobs } = get();
        await fetchJobs();
    },

    loadMoreJobs: async () => {
        const { jobs, isLoading, hasMore } = get();
        if (!hasMore || isLoading) return;

        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        const newJobs = Array(NUMBER_OF_JOBS).fill({}).map((_, i) => ({
            company: `Microsoft ${jobs.length + i + 1}`,
            rating: 4.5,
            position: "Software Engineer II",
            location: "Cairo, Egypt",
            datePosted: "2023-10-15",
            industry: "Technology"
        }));

        set(state => ({
            jobs: [...state.jobs, ...newJobs],
            hasMore: newJobs.length >= NUMBER_OF_JOBS,
            isLoading: false,
        }));
    },
}));

export default useJobStore;