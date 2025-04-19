import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { CompanyProfileInfo, UserCredentials } from '../../types/profile.ts';
import { CompanyProfileReviewsFilters, Review } from '../../types/review.ts';
import config from "../../../config/config.ts";
import { formatDistanceToNow, formatDate } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserRole } from '../User Slices/userSlice.ts';
import { Job } from '../../types/job.ts';
import { CompanyProfileJobsFilters } from '../../types/job.ts';
const { paginationLimit } = config;

export interface CompanyProfileSlice {
    companyProfileInfo: CompanyProfileInfo;
    companyProfileSelectedId: number | null;
    companyProfileUpdateInfo: (profile: CompanyProfileInfo) => Promise<void>;
    companyProfileFetchInfo: () => Promise<void>;
    companyProfileSetSelectedId: (id: number) => Promise<void>;
    /* industries will be used in the company industries dialog, and to populate industries filter
    in the jobs section*/
    companyProfileFetchIndustries: () => Promise<void>;
    companyProfileFetchLocations: () => Promise<void>;

    companyCredentials: UserCredentials;
    companyProfileFetchEmail: () => Promise<void>;
    companyProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;

    companyProfileReviews: Review[];
    companyProfileReviewsHasMore: boolean;
    companyProfileReviewsPage: number;
    companyProfileReviewsIsLoading: boolean;
    companyProfileReviewsFilters: CompanyProfileReviewsFilters;
    companyProfileFetchReviews: () => Promise<void>;
    companyProfileSetReviewsFilters: (filters: Partial<CompanyProfileSlice['companyProfileReviewsFilters']>) => Promise<void>;

    companyProfileJobs: Job[];
    companyProfileJobsPage: number;
    companyProfileJobsHasMore: boolean;
    companyProfileIsJobsLoading: boolean;
    companyProfileJobsFilters: CompanyProfileJobsFilters;
    companyProfileIsJobDetailsDialogOpen: boolean;
    companyProfileJobTitlesFilter: { id: number; title: string }[];
    companyProfileFetchJobs: () => Promise<void>;
    companyProfileSetSelectedJobId: (id: number) => Promise<void>;
    companyProfileSetJobsFilters: (filters: Partial<CompanyProfileSlice['companyProfileJobsFilters']>) => Promise<void>;
    companyProfileFetchJobTitlesFilter: () => Promise<void>;
    companyProfileSetJobDetailsDialogOpen: (isOpen: boolean) => void;

    companyProfileClear: () => void;
}

export const createCompanyProfileSlice: StateCreator<CombinedState, [], [], CompanyProfileSlice> = (set, get) => ({
    companyProfileInfo: {
        id: 0,
        name: '',
        image: '',
        overview: '',
        type: '',
        foundedIn: 0,
        size: 0,
        rating: 0,
        reviewsCount: 0,
        locationsCount: 0,
        industriesCount: 0,
        jobsCount: 0,
        locations: [],
        industries: [],
    },
    companyCredentials: {
        email: '',
        password: ''
    },
    companyProfileReviews: [],
    companyProfileReviewsHasMore: true,
    companyProfileReviewsPage: 1,
    companyProfileReviewsIsLoading: false,
    companyProfileSelectedId: null,
    companyProfileJobs: [],
    companyProfileJobsPage: 1,
    companyProfileJobsHasMore: true,
    companyProfileIsJobsLoading: false,
    companyProfileJobsFilters: {
        sortByDate: '',
        industryId: '',
        jobId: '',
        remote: false,
    },
    companyProfileIsJobDetailsDialogOpen: false,
    companyProfileJobTitlesFilter: [],
    companyProfileReviewsFilters: {
        sortByDate: '',
        rating: '',
    },

    companyProfileUpdateInfo: async (profile) => {
        set({ companyProfileInfo: profile });
    },

    companyProfileFetchInfo: async () => {
        // Add logic to fetch company profile info
    },

    companyProfileSetSelectedId: async (id) => {
        set({ companyProfileSelectedId: id, companyProfileIsJobDetailsDialogOpen: true });
    },

    companyProfileFetchIndustries: async () => {
        // Add logic to fetch industries
    },

    companyProfileFetchLocations: async () => {
        // Add logic to fetch locations
    },

    companyProfileFetchEmail: async () => {
        // Add logic to fetch email
    },

    companyProfileUpdateCredentials: async (credentials) => {
        set({ companyCredentials: credentials });
    },

    companyProfileFetchReviews: async () => {
        // Add logic to fetch reviews
    },

    companyProfileSetReviewsFilters: async (filters) => {

    },

    companyProfileFetchJobs: async () => {
        // Add logic to fetch jobs
    },

    companyProfileSetSelectedJobId: async (id) => {
        set({ companyProfileIsJobDetailsDialogOpen: true });
        get().forYouTabSetSelectedJobId(id);
    },

    companyProfileSetJobsFilters: async (filters) => {
        set((state) => ({
            companyProfileJobsFilters: { ...state.companyProfileJobsFilters, ...filters },
        }));
    },

    companyProfileFetchJobTitlesFilter: async () => {
        // Add logic to fetch job titles filter
    },

    companyProfileSetJobDetailsDialogOpen: (isOpen) => {
        set({ companyProfileIsJobDetailsDialogOpen: isOpen });
    },

    companyProfileClear: () => {
        set({
            companyProfileInfo: {
                id: 0,
                name: '',
                image: '',
                overview: '',
                type: '',
                foundedIn: 0,
                size: 0,
                rating: 0,
                reviewsCount: 0,
                locationsCount: 0,
                industriesCount: 0,
                jobsCount: 0,
                locations: [],
                industries: [],
            },
            companyCredentials: {
                email: '',
                password: ''
            },
            companyProfileReviews: [],
            companyProfileReviewsHasMore: true,
            companyProfileReviewsPage: 1,
            companyProfileReviewsIsLoading: false,
            companyProfileSelectedId: null,
            companyProfileJobs: [],
            companyProfileJobsPage: 1,
            companyProfileJobsHasMore: true,
            companyProfileIsJobsLoading: false,
            companyProfileJobsFilters: {
                sortByDate: '',
                industryId: '',
                jobId: '',
                remote: false,
            },
            companyProfileJobTitlesFilter: []
        });
    },
});