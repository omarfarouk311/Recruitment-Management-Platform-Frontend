import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { CompanyProfileInfo, UserCredentials } from '../../types/profile.ts';
import { CompanyProfileReviewsFilters, Review } from '../../types/review.ts';
import config from "../../../config/config.ts";
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { Job } from '../../types/job.ts';
import { CompanyProfileJobsFilters } from '../../types/job.ts';
import { showErrorToast } from '../../util/errorHandler.ts';
const { paginationLimit } = config;

export interface CompanyProfileSlice {
    companyProfileInfo: CompanyProfileInfo;
    companyProfileUpdateInfo: (profile: CompanyProfileInfo) => Promise<void>;
    companyProfileFetchInfo: (id?: string) => Promise<void>;
    /* industries will be used in the company industries dialog, and to populate industries filter
    in the jobs section*/
    companyProfileFetchIndustries: (id?: string) => Promise<void>;
    companyProfileFetchLocations: (id?: string) => Promise<void>;

    companyCredentials: UserCredentials;
    companyProfileFetchEmail: () => Promise<void>;
    companyProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;

    companyProfileReviews: Review[];
    companyProfileReviewsHasMore: boolean;
    companyProfileReviewsPage: number;
    companyProfileReviewsIsLoading: boolean;
    companyProfileReviewsFilters: CompanyProfileReviewsFilters;
    companyProfileFetchReviews: (id?: string) => Promise<void>;
    companyProfileSetReviewsFilters: (filters: Partial<CompanyProfileSlice['companyProfileReviewsFilters']>, id?: string) => Promise<void>;

    companyProfileJobs: Job[];
    companyProfileJobsPage: number;
    companyProfileJobsHasMore: boolean;
    companyProfileIsJobsLoading: boolean;
    companyProfileJobsFilters: CompanyProfileJobsFilters;
    companyProfileFetchJobs: (id?: string) => Promise<void>;
    companyProfileSetJobsFilters: (filters: Partial<CompanyProfileSlice['companyProfileJobsFilters']>, id?: string) => Promise<void>;

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
    companyProfileReviewsFilters: {
        sortByDate: '',
        rating: '',
    },

    companyProfileUpdateInfo: async (profile) => {
        set({ companyProfileInfo: profile });
    },

    companyProfileFetchInfo: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const response = await axios.get(`${config.API_BASE_URL}/companies/${targetId}`);
            const companyData = response.data;

            set({
                companyProfileInfo: {
                    id: companyData.id,
                    name: companyData.name,
                    image: `${config.API_BASE_URL}/companies/${targetId}/image`,
                    overview: companyData.overview,
                    type: companyData.type,
                    foundedIn: companyData.foundedIn,
                    size: companyData.size,
                    rating: companyData.rating,
                    reviewsCount: companyData.reviewsCount,
                    locationsCount: companyData.locationsCount,
                    industriesCount: companyData.industriesCount,
                    jobsCount: companyData.jobsCount,
                    locations: [],
                    industries: [],
                },
            });
        }
        catch (error) {
            showErrorToast('Failed to fetch company profile info');
        }
    },

    companyProfileFetchIndustries: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const response = await axios.get(`${config.API_BASE_URL}/companies/${targetId}/industries`);
            const industriesData = response.data;

            const industries = industriesData.map((industry: { id: number, name: string }) => ({
                id: industry.id,
                name: industry.name
            }));

            set(state => ({
                companyProfileInfo: {
                    ...state.companyProfileInfo,
                    industries
                }
            }));
        }
        catch (err) {
            showErrorToast('Failed to fetch company industries');
        }
    },

    companyProfileFetchLocations: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const rest = await axios.get(`${config.API_BASE_URL}/companies/${targetId}/locations`);
            const locationsData = rest.data;

            const locations = locationsData.map((location: { country: string, city: string }) => ({
                country: location.country,
                city: location.city
            }));

            set(state => ({
                companyProfileInfo: {
                    ...state.companyProfileInfo,
                    locations: locations
                },
            }));
        }
        catch (err) {
            showErrorToast('Failed to fetch company locations');
        }
    },

    companyProfileFetchEmail: async () => {

    },

    companyProfileUpdateCredentials: async (credentials) => {
        set({ companyCredentials: credentials });
    },

    companyProfileFetchReviews: async (id) => {
        const { companyProfileReviewsIsLoading, companyProfileReviewsHasMore, companyProfileReviewsPage,
            companyProfileReviewsFilters, userId } = get();

        if (!companyProfileReviewsHasMore || companyProfileReviewsIsLoading) return;

        const targetId = id || userId;
        set({ companyProfileReviewsIsLoading: true });

        const params = {
            page: companyProfileReviewsPage,
            sortByDate: companyProfileReviewsFilters.sortByDate,
            rating: companyProfileReviewsFilters.rating,
        };

        for (const key in params) {
            if (!params[key as keyof CompanyProfileReviewsFilters]) {
                delete params[key as keyof CompanyProfileReviewsFilters];
            }
        }

        try {
            const response = await axios.get(`${config.API_BASE_URL}/companies/${targetId}/reviews`, { params });
            const reviewsData = response.data;

            const reviews = reviewsData.map((review: any): Review => ({
                id: review.id,
                title: review.title,
                role: review.role,
                createdAt: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }),
                rating: review.rating,
                description: review.description,
                companyData: {
                    id: review.companyId,
                    name: review.companyName
                }
            }));

            set((state) => ({
                companyProfileReviews: [...state.companyProfileReviews, ...reviews],
                companyProfileReviewsHasMore: reviews.length === paginationLimit,
                companyProfileReviewsPage: state.companyProfileReviewsPage + 1,
                companyProfileReviewsIsLoading: false
            }));
        }
        catch (err) {
            set({ companyProfileReviewsIsLoading: false });
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                showErrorToast('Company not found');
            }
            else showErrorToast('Failed to fetch company reviews');
        }
    },

    companyProfileSetReviewsFilters: async (filters, id) => {
        set((state) => ({
            companyProfileReviewsFilters: { ...state.companyProfileReviewsFilters, ...filters },
            companyProfileReviews: [],
            companyProfileReviewsHasMore: true,
            companyProfileReviewsPage: 1,
            companyProfileReviewsIsLoading: false,
        }));

        await get().companyProfileFetchReviews(id);
    },

    companyProfileFetchJobs: async (id) => {
        const { companyProfileIsJobsLoading, companyProfileJobsHasMore, companyProfileJobsPage,
            companyProfileJobsFilters, userId } = get();
        if (!companyProfileJobsHasMore || companyProfileIsJobsLoading) return;

        const targetId = id || userId;
        set({ companyProfileIsJobsLoading: true });

        const params = {
            page: companyProfileJobsPage,
            sortByDate: companyProfileJobsFilters.sortByDate,
            industryId: companyProfileJobsFilters.industryId,
            jobId: companyProfileJobsFilters.jobId,
            remote: companyProfileJobsFilters.remote ? 'true' : ''
        };

        for (const key in params) {
            if (!params[key as keyof CompanyProfileJobsFilters]) {
                delete params[key as keyof CompanyProfileJobsFilters];
            }
        }

        try {
            const response = await axios.get(`${config.API_BASE_URL}/companies/${targetId}/jobs`, { params });
            const jobsData = response.data;

            const jobs = jobsData.map((job: any): Job => ({
                id: job.id,
                title: job.title,
                country: job.country,
                city: job.city,
                datePosted: job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : '',
                companyData: {
                    id: job.companyId,
                    name: job.companyName,
                    rating: job.companyRating,
                    image: `${config.API_BASE_URL}/companies/${job.companyId}/image`,
                }
            }));

            set((state) => ({
                companyProfileJobs: [...state.companyProfileJobs, ...jobs],
                companyProfileJobsHasMore: jobs.length === paginationLimit,
                companyProfileJobsPage: state.companyProfileJobsPage + 1,
                companyProfileIsJobsLoading: false,
            }));
        } catch (err) {
            set({ companyProfileIsJobsLoading: false });
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                showErrorToast('Company not found');
            }
            else showErrorToast('Failed to fetch company jobs');
        }
    },

    companyProfileSetJobsFilters: async (filters, id) => {
        set((state) => ({
            companyProfileJobsFilters: { ...state.companyProfileJobsFilters, ...filters },
            companyProfileJobsPage: 1,
            companyProfileJobs: [],
            companyProfileJobsHasMore: true,
            companyProfileIsJobsLoading: false,
            companyProfileSelectedJobId: null,
        }));

        await get().companyProfileFetchJobs(id);
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
        });
    },
});