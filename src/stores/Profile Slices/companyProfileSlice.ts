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
import { authRefreshToken } from '../../util/authUtils.ts';
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
    companyProfileAddReview: (companyId: number, review: { rating: number, description: string, title: string, role: string }) => Promise<void>;
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
        industry: '',
        remote: false,
    },
    companyProfileReviewsFilters: {
        sortByDate: '',
        rating: '',
    },

    companyProfileUpdateInfo: async (profile) => {
        const { userId } = get();
        try {
            await axios.put(
                `${config.API_BASE_URL}/companies/profile/`,
                {
                    name: profile.name,
                    overview: profile.overview,
                    type: profile.type === 'Public',
                    foundedIn: profile.foundedIn,
                    size: profile.size,
                    locations: profile.locations,
                    industriesIds: profile.industries.map((industry) => industry.id),
                },
                { withCredentials: true }
            );

            if (profile.image instanceof File) {
                await axios.post(
                    `${config.API_BASE_URL}/companies/${userId}/image`,
                    profile.image,
                    {
                        headers: {
                            'Content-Type': profile.image.type,
                            'File-Name': profile.image.name,
                        },
                        withCredentials: true
                    }
                );
            }

            set({
                companyProfileInfo: {
                    ...profile,
                    image: `${config.API_BASE_URL}/companies/${userId}/image?t=${Date.now()}`
                },
                userName: profile.name,
                userImage: `${config.API_BASE_URL}/companies/${userId}/image?t=${Date.now()}`
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileUpdateInfo(profile);
                    }
                }
                else if (err.response?.status === 400) {
                    if (err.response.data.message !== 'Validation Error') {
                        showErrorToast(err.response.data.message);
                    }
                    else {
                        const validationErrors: string[] = err.response.data.validationErrors;
                        validationErrors.forEach((error) => {
                            showErrorToast(error);
                        });
                    }
                    throw err;
                }
                else if (err.response?.status === 413) {
                    showErrorToast('Image size exceeded 10MB');
                    throw err;
                }
                else {
                    showErrorToast('Failed to update company profile');
                    throw err;
                }
            }
        }
    },

    companyProfileFetchInfo: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/companies/${targetId}`,
                { withCredentials: true }
            );
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
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileFetchInfo(id);
                    }
                }
                else if (err.response?.status === 404) {
                    showErrorToast('Company not found');
                }
                else {
                    showErrorToast('Failed to fetch profile info');
                }
            }
        }
    },

    companyProfileFetchIndustries: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/companies/${targetId}/industries`,
                { withCredentials: true }
            );
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
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileFetchIndustries(id);
                    }
                }
                else {
                    showErrorToast('Failed to fetch company industries');
                }
            }
        }
    },

    companyProfileFetchLocations: async (id) => {
        const { userId } = get();
        const targetId = id || userId;

        try {
            const rest = await axios.get(
                `${config.API_BASE_URL}/companies/${targetId}/locations`,
                { withCredentials: true }
            );
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
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileFetchLocations(id);
                    }
                }
                else {
                    showErrorToast('Failed to fetch company locations');
                }
            }
        }
    },

    companyProfileFetchEmail: async () => {

    },

    companyProfileUpdateCredentials: async (credentials) => {
    },

    companyProfileFetchReviews: async (id) => {
        const { companyProfileReviewsHasMore, companyProfileReviewsPage, companyProfileReviewsFilters, userId } = get();

        if (!companyProfileReviewsHasMore) return;

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
            const response = await axios.get(
                `${config.API_BASE_URL}/companies/${targetId}/reviews`,
                { params, withCredentials: true }
            );
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
                companyProfileReviewsPage: state.companyProfileReviewsPage + 1
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileFetchReviews(id);
                    }
                }
                else showErrorToast('Failed to fetch company reviews');
            }
        }
        finally {
            set({ companyProfileReviewsIsLoading: false });
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

    companyProfileAddReview: async (companyId, review) => {
        try {
            const res = await axios.post(
                `${config.API_BASE_URL}/reviews`,
                {
                    companyId,
                    title: review.title,
                    rating: review.rating,
                    description: review.description,
                    role: review.role
                },
                { withCredentials: true }
            );

            set(state => ({
                companyProfileReviews: [
                    {
                        ...review,
                        id: res.data.id,
                        createdAt: formatDistanceToNow(new Date(), { addSuffix: true }),
                        companyData: { id: companyId, name: state.companyProfileInfo.name }
                    },
                    ...state.companyProfileReviews],
            }))
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) await get().companyProfileAddReview(companyId, review);
                }
                else if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        showErrorToast(error);
                    });
                }
                else if (err.response?.status === 403) {
                    return showErrorToast('You do not have permission to add a review');
                }
                else showErrorToast('Failed to add review');
            }
        }
    },

    companyProfileFetchJobs: async (id) => {
        const { companyProfileJobsHasMore, companyProfileJobsPage, companyProfileJobsFilters, userId } = get();
        if (!companyProfileJobsHasMore) return;

        const targetId = id || userId;
        set({ companyProfileIsJobsLoading: true });

        const params = {
            page: companyProfileJobsPage,
            sortByDate: companyProfileJobsFilters.sortByDate,
            industry: companyProfileJobsFilters.industry,
            remote: companyProfileJobsFilters.remote ? 'true' : ''
        };

        for (const key in params) {
            if (!params[key as keyof CompanyProfileJobsFilters]) {
                delete params[key as keyof CompanyProfileJobsFilters];
            }
        }

        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/companies/${targetId}/jobs`,
                { params, withCredentials: true }
            );
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
                companyProfileJobsPage: state.companyProfileJobsPage + 1
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().companyProfileFetchJobs(id);
                    }
                }
                else showErrorToast('Failed to fetch company jobs');
            }
        }
        finally {
            set({ companyProfileIsJobsLoading: false });
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
                industry: '',
                remote: false,
            },
        });
    },
});