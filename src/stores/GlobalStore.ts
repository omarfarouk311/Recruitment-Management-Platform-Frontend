import { create, StateCreator } from 'zustand';
import { mockDetailedJobs, mockJobs } from "../mock data/jobs";
import { mockCompanies } from "../mock data/companies";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Job, ForYouPageFilters, JobDetails } from '../types/job';
import { CompanyCard, CompaniesPageFilters } from "../types/company"

interface ForYouPageSlice {
    jobs: Job[];
    detailedJob: JobDetails | null;
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    selectedJobId: number | null;
    isDetailsLoading: boolean;
    jobsFilters: ForYouPageFilters;
    jobSearchQuery: string;
    fetchJobs: () => Promise<void>;
    setSelectedJobId: (id: number) => void;
    setJobsFilters: (filters: Partial<ForYouPageSlice['jobsFilters']>) => Promise<void>;
    setJobSearchQuery: (query: string) => void;
    applyJobSearch: () => Promise<void>;
}

interface CompaniesPageSlice {
    companies: CompanyCard[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    companiesFilters: CompaniesPageFilters;
    companySearchQuery: string;
    fetchCompanies: () => Promise<void>;
    setCompaniesFilters: (filters: Partial<ForYouPageSlice['jobsFilters']>) => Promise<void>;
    setCompanySearchQuery: (query: string) => void;
    applyCompanySearch: () => Promise<void>;
}

interface HomeTabsSlice {
    homeActiveTab: "For You" | "Companies";
    setHomeActiveTab: (tab: "For You" | "Companies") => void;
}

type CombinedState = ForYouPageSlice & CompaniesPageSlice & HomeTabsSlice;

const createForYouPageSlice: StateCreator<CombinedState, [], [], ForYouPageSlice> = (set, get, _api) => ({
    jobs: [],
    detailedJob: null,
    page: 1,
    hasMore: true,
    isLoading: false,
    selectedJobId: null,
    isDetailsLoading: false,
    jobsFilters: {
        datePosted: '',
        companyRating: '',
        industry: '',
        country: '',
        city: '',
        remote: false
    },
    jobSearchQuery: '',

    fetchJobs: async () => {
        const { page, hasMore, isLoading } = get();
        if (!hasMore || isLoading) return;
        set({ isLoading: true });

        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const startIndex = (page - 1) * 5;
                const endIndex = startIndex + 5;
                const newJobs = mockJobs.slice(startIndex, endIndex);

                set((state) => ({
                    jobs: [...state.jobs, ...newJobs],
                    hasMore: endIndex < mockJobs.length,
                    isLoading: false,
                    page: state.page + 1,
                }));
                resolve();
            }, 500));
        } catch (err) {
            set({ isLoading: false });
        }
    },

    setSelectedJobId: (id: number) => {
        // mock API call
        set({ isDetailsLoading: true });

        setTimeout(() => {
            set({
                selectedJobId: id,
                detailedJob: mockDetailedJobs[id],
                isDetailsLoading: false
            });
        }, 1000);
    },

    setJobsFilters: async (filters) => {
        set((state) => ({
            ForYouPageFilters: { ...state.jobsFilters, ...filters },
            jobs: [],
            detailedJob: null,
            page: 1,
            selectedJobId: null,
            isLoading: false,
            hasMore: true,
            isDetailsLoading: false,
        }));
        const { fetchJobs } = get();
        await fetchJobs();
    },

    setJobSearchQuery: (query: string) => {
        set({ jobSearchQuery: query });
    },

    applyJobSearch: async () => {
        set({
            jobs: [],
            page: 1,
            selectedJobId: null,
            detailedJob: null,
            isLoading: false,
            hasMore: true,
            isDetailsLoading: false,
        });
        const { fetchJobs } = get();
        await fetchJobs();
    },
});

const createCompaniesPageSlice: StateCreator<CombinedState, [], [], CompaniesPageSlice> = (set, get, _api) => ({
    companies: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    companiesFilters: {
        country: '',
        city: '',
        industry: '',
        type: '',
        sizeFrom: '',
        sizeTo: '',
        rating: ''
    },
    companySearchQuery: '',

    fetchCompanies: async () => {
        const { page, hasMore, isLoading } = get();
        if (!hasMore || isLoading) return;
        set({ isLoading: true });

        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const startIndex = (page - 1) * 5;
                const endIndex = startIndex + 5;
                const newCompanies = mockCompanies.slice(startIndex, endIndex);

                set((state) => ({
                    companies: [...state.companies, ...newCompanies],
                    hasMore: endIndex < mockJobs.length,
                    isLoading: false,
                    page: state.page + 1,
                }));
                resolve();
            }, 500));
        } catch (err) {
            set({ isLoading: false });
        }
    },

    setCompaniesFilters: async (filters) => {
        set((state) => ({
            companiesFilters: { ...state.companiesFilters, ...filters },
            companies: [],
            page: 1,
            isLoading: false,
            hasMore: true,
        }));
        const { fetchCompanies } = get();
        await fetchCompanies();
    },

    setCompanySearchQuery: (query: string) => {
        set({ jobSearchQuery: query });
    },

    applyCompanySearch: async () => {
        set({
            companies: [],
            page: 1,
            isLoading: false,
            hasMore: true,
        });
        const { fetchCompanies } = get();
        await fetchCompanies();
    },
});

const createHomeTabsSlice: StateCreator<CombinedState, [], [], HomeTabsSlice> = (set, get, _api) => ({
    homeActiveTab: 'For You',
    setHomeActiveTab: (tab) => {
        set({ homeActiveTab: tab });
    }
});

const useStoreBase = create<CombinedState>((...a) => ({
    ...createForYouPageSlice(...a),
    ...createCompaniesPageSlice(...a),
    ...createHomeTabsSlice(...a)
}));

export default createSelectorHooks(useStoreBase);