import { StateCreator } from 'zustand';
import { Job, ForYouTabFilters, JobDetails } from '../../types/job';
import { CombinedState } from '../storeTypes';
import config from "../../../config/config";
import { HomePageTabs } from './homePageSlice';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { showErrorToast } from '../../util/errorHandler';
import { authRefreshToken } from '../../util/authUtils';
const { paginationLimit, API_BASE_URL } = config;

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
    forYouTabFetchJobs: () => Promise<void>;
    forYouTabSetSelectedJobId: (id: number) => Promise<void>;
    forYouTabSetFilters: (filters: Partial<ForYouTabSlice['forYouTabFilters']>) => Promise<void>;
    forYouTabSetSearchQuery: (query: string) => void;
    forYouTabApplySearch: () => Promise<void>;
    forYouTabPushToDetailedJobs: (id: number) => Promise<void>;
    forYouTabPopFromDetailedJobs: () => void;
    forYouTabRemoveRecommendation: (id: number) => Promise<void>;
    forYouTabApplyToJob: (id: number, cvId: number) => Promise<void>;
    forYouTabReportJob: (id: number, title: string, message: string) => Promise<void>;
    forYouTabFetchCompanyIndustries: (companyId: number, jobId: number) => Promise<void>;
    forYouTabClear: () => void;
    forYouTabClearDetailedJobs: () => void;
}

async function fetchJobDetails(id: number): Promise<JobDetails> {
    const [resDetails, resSimilar] = await Promise.all([
        axios.get(`${API_BASE_URL}/jobs/${id}`),
        axios.get(`${API_BASE_URL}/jobs/${id}/similar`)
    ]);

    const response = resDetails.data;
    const similarJobs = resSimilar.data;

    const transformedDetails: JobDetails = {
        // Job Data
        id,
        title: response.jobData.title,
        description: response.jobData.description,
        country: response.jobData.country,
        city: response.jobData.city,
        datePosted: formatDistanceToNow(new Date(response.jobData.created_at), { addSuffix: true }),
        applicantsCount: response.jobData.applied_cnt,
        jobSkillsCount: response.jobData.skills_cnt,
        remote: response.jobData.remote,
        closed: response.jobData.closed,
        matchingSkillsCount: response.skillMatches,
        applied: response.hasApplied,
        reported: response.hasReported,

        // Company Data
        companyData: {
            id: response.companyData.id,
            name: response.companyData.name,
            rating: response.companyData.rating,
            size: response.companyData.size,
            foundedIn: response.companyData.founded_in,
            type: response.companyData.type ? 'Public' : 'Private',
            industriesCount: response.companyData.industriesCount,
            industries: [],
            image: `${API_BASE_URL}/companies/${response.companyData.id}/image`
        },

        // Company Reviews
        companyReviews: response.reviews.map((review: any) => ({
            id: review.id,
            title: review.title,
            rating: review.rating,
            description: review.description,
            createdAt: formatDistanceToNow(new Date(review.created_at), { addSuffix: true }),
            role: review.role,
            companyData: {
                id: response.companyData.id,
                name: response.companyData.name
            }
        })),

        similarJobs: similarJobs.map((similarJob: any) => ({
            id: similarJob.id,
            title: similarJob.title,
            country: similarJob.country,
            city: similarJob.city,
            datePosted: formatDistanceToNow(new Date(similarJob.createdAt), { addSuffix: true }),
            companyData: {
                id: similarJob.companyId,
                name: similarJob.companyName,
                rating: similarJob.companyRating,
                image: `${API_BASE_URL}/companies/${similarJob.companyId}/image`
            }
        }))
    };

    return transformedDetails;
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

    forYouTabFetchJobs: async () => {
        const { forYouTabHasMore, forYouTabIsJobsLoading, forYouTabFilters, forYouTabSearchQuery,
            forYouTabPage } = get();
        if (!forYouTabHasMore || forYouTabIsJobsLoading) return;

        set({ forYouTabIsJobsLoading: true });

        const params: any = { page: forYouTabPage };
        for (const key in forYouTabFilters) {
            if (forYouTabFilters[key as keyof ForYouTabFilters]) {
                params[key] = forYouTabFilters[key as keyof ForYouTabFilters];
            }
        }

        if (params['remote']) params['remote'] = 'true';

        if (params['datePosted'] === 'today') {
            const now = new Date(); // Local time

            // Start of the day (local time)
            const fromDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0, 0, 0, 0
            );

            // End of the day (local time)
            const toDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23, 59, 59, 999
            );

            // Convert to ISO strings
            params['fromDate'] = fromDate.toISOString();
            params['toDate'] = toDate.toISOString();
        }

        else if (params['datePosted'] === 'last week') {
            const now = new Date(); // Current date and time

            // Calculate date 7 days ago
            const fromDate = new Date(now);
            fromDate.setDate(now.getDate() - 7);
            fromDate.setHours(0, 0, 0, 0); // Start of day 7 days ago

            // End of current day
            const toDate = new Date(now);
            toDate.setHours(23, 59, 59, 999);

            // Convert to UTC ISO strings
            params['fromDate'] = fromDate.toISOString();
            params['toDate'] = toDate.toISOString();
        }

        else if (params['datePosted'] === 'last month') {
            const now = new Date(); // Current date and time

            // Calculate date 30 days ago
            const fromDate = new Date(now);
            fromDate.setDate(now.getDate() - 30);
            fromDate.setHours(0, 0, 0, 0); // Start of day 30 days ago

            // End of current day
            const toDate = new Date(now);
            toDate.setHours(23, 59, 59, 999);

            // Assign to params
            params['fromDate'] = fromDate.toISOString();
            params['toDate'] = toDate.toISOString();
        }

        delete params['datePosted'];

        if (forYouTabSearchQuery) params['word'] = forYouTabSearchQuery;

        const url = `${API_BASE_URL}/seekers/jobs${!forYouTabSearchQuery ? '/recommended' : ''}`

        try {
            const res = await axios.get(url, { params });

            const newJobs: Job[] = res.data.map((job: any) => ({
                id: job.id,
                title: job.title,
                country: job.country,
                city: job.city,
                datePosted: formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }),
                companyData: {
                    id: job.companyId,
                    name: job.companyName,
                    rating: job.companyRating,
                    image: `${API_BASE_URL}/companies/${job.companyId}/image`,
                }
            }));

            set((state) => {
                return {
                    forYouTabJobs: [...state.forYouTabJobs, ...newJobs],
                    forYouTabHasMore: newJobs.length === paginationLimit,
                    forYouTabPage: state.forYouTabPage + 1,
                }
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabFetchJobs();
                    }
                }
                else if (err.response?.status === 400) {
                    err.response?.data.validationErrors.map((validationError: any) => {
                        showErrorToast(validationError.message);
                    });
                }
                else if (err.response?.status === 403) {
                    showErrorToast('Unauthorized access');
                }
                else {
                    showErrorToast('Failed to fetch jobs');
                }
            }
        }
        finally {
            set({ forYouTabIsJobsLoading: false });
        }
    },

    forYouTabSetSelectedJobId: async (id: number) => {
        if (id === get().forYouTabSelectedJobId) return;
        set({ forYouTabIsDetailsLoading: true, forYouTabSelectedJobId: id });

        try {
            const transformedDetails = await fetchJobDetails(id);
            set({ forYouTabDetailedJobs: [transformedDetails] });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabSetSelectedJobId(id);
                    }
                }
                else if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                }
                else {
                    showErrorToast('Failed to fetch job details');
                }
            }
        }
        finally {
            set({ forYouTabIsDetailsLoading: false });
        }
    },

    forYouTabSetFilters: async (filters) => {
        set((state) => ({
            forYouTabFilters: { ...state.forYouTabFilters, ...filters },
            forYouTabJobs: [],
            forYouTabDetailedJobs: [],
            forYouTabPage: 1,
            forYouTabSelectedJobId: null,
            forYouTabIsJobsLoading: false,
            forYouTabHasMore: true,
            forYouTabIsDetailsLoading: false,
        }));

        get().forYouTabFetchJobs();
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

        get().forYouTabFetchJobs();
    },

    forYouTabPushToDetailedJobs: async (id: number) => {
        set({ forYouTabIsDetailsLoading: true });
        try {
            const transformedDetails = await fetchJobDetails(id);
            set((state) => ({
                forYouTabDetailedJobs: [transformedDetails, ...state.forYouTabDetailedJobs]
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabPushToDetailedJobs(id);
                    }
                }
                else if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                }
                else {
                    showErrorToast('Failed to fetch job details');
                }
            }
        }
        finally {
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
    },

    forYouTabRemoveRecommendation: async (id: number) => {
        try {
            await axios.delete(`${API_BASE_URL}/seekers/jobs/recommended/${id}`);
            set((state) => ({
                forYouTabJobs: state.forYouTabJobs.filter((job) => job.id !== id)
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabRemoveRecommendation(id);
                    }
                }
                else {
                    showErrorToast('Failed to remove recommended job');
                }
            }
        }
    },

    forYouTabApplyToJob: async (id, cvId) => {
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/jobs/apply`, {
                jobId: id,
                cvId: cvId
            });

            set((state) => ({
                forYouTabDetailedJobs: state.forYouTabDetailedJobs.map(
                    (job) => job.id === id ? { ...job, applied: true } : job
                )
            }))
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabApplyToJob(id, cvId);
                    }
                }
                else if (err.response?.status === 400) {
                    if (err.response?.data.validationErrors.length > 0) {
                        err.response.data.validationErrors.map((validationError: any) => {
                            showErrorToast(validationError.message);
                        });
                    }
                    else showErrorToast('Job is closed');
                    throw err;
                }
                else if (err.response?.status === 404) {
                    showErrorToast('Job or CV not found');
                    throw err;
                }
                else if (err.response?.status === 409) {
                    showErrorToast("You have already applied on this job");
                    throw err;
                }
                else {
                    showErrorToast('Failed to apply on the job');
                    throw err;
                }
            }
        }
    },

    forYouTabReportJob: async (id, title, message) => {
        try {
            await axios.post(`${config.API_BASE_URL}/reports`, {
                jobId: id,
                title,
                description: message
            });

            set((state) => ({
                forYouTabDetailedJobs: state.forYouTabDetailedJobs.map(
                    (job) => job.id === id ? { ...job, reported: true } : job
                )
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabReportJob(id, title, message);
                    }
                }
                else if (err.response?.status === 400) {
                    err.response?.data.validationErrors.map((validationError: any) => {
                        showErrorToast(validationError.message);
                    });
                    throw err;
                }
                else if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                    throw err;
                }
                else if (err.response?.status === 409) {
                    showErrorToast("You have already reported this job");
                    throw err;
                }
                else {
                    showErrorToast('Failed to report the job');
                    throw err;
                }
            }
        }
    },

    forYouTabFetchCompanyIndustries: async (companyId, jobId) => {
        if (get().forYouTabDetailedJobs.find((job) => job.id === jobId)?.companyData.industries.length) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/companies/${companyId}/industries`);
            const industries = res.data.map((industry: any) => industry.name);

            set((state) => {
                return {
                    forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === jobId ?
                        { ...job, companyData: { ...job.companyData, industries: industries } } : job)
                }
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().forYouTabFetchCompanyIndustries(companyId, jobId);
                    }
                }
                else {
                    showErrorToast('Failed to fetch company industries');
                }
            }
        }
    },

    forYouTabClear: () => {
        set({
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
        });
    },

    forYouTabClearDetailedJobs: () => {
        set({
            forYouTabDetailedJobs: [],
            forYouTabIsDetailsLoading: false,
        });
    }

});