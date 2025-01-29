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
    setFilters: (filters: Partial<JobStore['filters']>) => void;
    setSearchCriteria: (criteria: Partial<JobStore['searchCriteria']>) => void;
    loadMoreJobs: () => Promise<void>;
    applySearch: () => Promise<void>;
}

const debounce = <T extends (...args: any[]) => Promise<void>>(
    fn: T,
    delay: number
) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        return new Promise<void>((resolve) => {
            timeoutId = setTimeout(async () => {
                await fn(...args);
                resolve();
            }, delay);
        });
    };
};

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
    hasMore: true,

    fetchJobs: debounce(async () => {
        const { filters, searchCriteria } = get();
        set({ isLoading: true });

        try {
            await new Promise<void>(resolve => setTimeout(() => {
                // Call the API with filters and search criteria
                const result = baseJobs;
                filters;
                searchCriteria;
                ///
                set({
                    jobs: result,
                    hasMore: result.length < 20,
                    isLoading: false
                });

                resolve();
            }, 500));
        }

        catch (err) {
            set({ isLoading: false });
        }
    }, 300),

    setFilters: (filters) => {
        set(state => ({ filters: { ...state.filters, ...filters } }));
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
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newJobs = Array(5).fill({}).map((_, i) => ({
            company: `Microsoft ${jobs.length + i + 1}`,
            rating: 4.5,
            position: "Software Engineer II",
            location: "Cairo, Egypt",
            datePosted: "2023-10-15",
            industry: "Technology"
        }));

        set(state => ({
            jobs: [...state.jobs, ...newJobs],
            hasMore: state.jobs.length + newJobs.length < 20,
            isLoading: false,
        }));
    },
}));

export default useJobStore;