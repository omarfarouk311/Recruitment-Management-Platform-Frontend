import { StateCreator } from 'zustand';
import { Job, ForYouTabFilters, JobDetails } from '../../types/job';
import { mockDetailedJobs, mockJobs } from "../../mock data/seekerForYou";
import { mockCompanyIndustries } from '../../mock data/seekerCompanies';
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
    forYouTabReportJob: (id: number, message: string) => Promise<void>;
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
        matchingSkillsCount: response.skillMatches,
        jobSkillsCount: response.jobData.skills_cnt,
        remote: response.jobData.remote,
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

        else if (params['datePosted'] === 'this week') {
            const now = new Date(); // Local time
            const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

            // Calculate days to subtract to get to the most recent Saturday
            const daysToSubtract = (dayOfWeek + 1) % 7; // 0 = Saturday, 1 = Sunday, etc.

            // Start of the week (Saturday at 00:00:00)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - daysToSubtract);
            startOfWeek.setHours(0, 0, 0, 0);

            // End of the week (Friday at 23:59:59.999)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get to Friday
            endOfWeek.setHours(23, 59, 59, 999);

            // Convert to UTC ISO strings
            params['fromDate'] = startOfWeek.toISOString();
            params['toDate'] = endOfWeek.toISOString();
        }

        else if (params['datePosted'] === 'this month') {
            const now = new Date(); // Local time

            // Start of current month (1st day at 00:00:00)
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

            // End of current month (last day at 23:59:59.999)
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            // Assign to params
            params['fromDate'] = startOfMonth.toISOString();
            params['toDate'] = endOfMonth.toISOString();
        }

        delete params['datePosted'];

        if (forYouTabSearchQuery) params['word'] = forYouTabSearchQuery;

        const url = `${API_BASE_URL}/seekers/jobs${!forYouTabSearchQuery ? '/recommended' : ''}`

        try {
            const res = await axios.get(url, {
                params
            });

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
                    forYouTabIsJobsLoading: false,
                    forYouTabPage: state.forYouTabPage + 1,
                }
            });
        }
        catch (err) {
            set({ forYouTabIsJobsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    err.response?.data.validationErrors.map((validationError: any) => {
                        showErrorToast(validationError.message);
                    });
                }
                else if (err.response?.status === 500) {
                    showErrorToast('Something went wrong');
                }
                else if (err.response?.status === 403) {
                    showErrorToast('You are not authorized to access this resource');
                }
            }
        }
    },

    forYouTabSetSelectedJobId: async (id: number) => {
        if (id === get().forYouTabSelectedJobId) return;
        set({ forYouTabIsDetailsLoading: true, forYouTabSelectedJobId: id });

        try {
            const transformedDetails = await fetchJobDetails(id);
            set({
                forYouTabDetailedJobs: [transformedDetails],
                forYouTabIsDetailsLoading: false
            });
        }
        catch (err) {
            set({ forYouTabIsDetailsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                } else if (err.response?.status === 500) {
                    showErrorToast('Something went wrong');
                }
            }
            else {
                showErrorToast('Something went wrong');
            }
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

    forYouTabPushToDetailedJobs: async (id: number) => {
        set({ forYouTabIsDetailsLoading: true });
        // mock API call
        try {
            const transformedDetails = await fetchJobDetails(id);
            set((state) => ({
                forYouTabDetailedJobs: [
                    transformedDetails,
                    ...state.forYouTabDetailedJobs
                ],
                forYouTabIsDetailsLoading: false
            }));
        }
        catch (err) {
            set({ forYouTabIsDetailsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                } else if (err.response?.status === 500) {
                    showErrorToast('Something went wrong');
                }
            }
            else {
                showErrorToast('Something went wrong');
            }
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
            showErrorToast('Something went wrong');
        }
    },

    forYouTabApplyToJob: async (id, cvId) => {
        try {
            let res;
            try {
                res = await axios.post(`${config.API_BASE_URL}/seekers/jobs/apply`, {
                    jobId: id,
                    cvId: cvId
                });
            } catch(err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                   await authRefreshToken();
                }
                else {
                    throw err;
                }
            }

            if(!res) {
                res = await axios.post(`${config.API_BASE_URL}/seekers/jobs/apply`, {
                    jobId: id,
                    cvId: cvId
                })
            }
            set((state) => ({
                forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === id ? { ...job, applied: true } : job)
            }))
        }
        catch (err) {
            if(axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.map((validationError: any) => {
                    showErrorToast(validationError.message);
                });
            }
            else {
                showErrorToast('Something went wrong!')
            }
        }
    },

    forYouTabReportJob: async (id, message) => {
        try {
            let res;
            try {
                console.log(message)
                res = await axios.post(`${config.API_BASE_URL}/reports`, {
                    jobId: id,
                    message: message,
                    title: "Very bad!"
                });
            } catch (err) {
                if(axios.isAxiosError(err) && err.response?.status === 401) {
                    await authRefreshToken();
                }
                else {
                    throw err;
                }
            }
            if(!res) {
                res = await axios.post(`${config.API_BASE_URL}/reports`, {
                    jobId: id,
                    message: message
                });
            }
            set((state) => ({
                forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === id ? { ...job, reported: true } : job)
            }));
        }
        catch (err) {
            if(axios.isAxiosError(err) && err.response?.status === 400) {
                err.response?.data.validationErrors.map((validationError: any) => {
                    showErrorToast(validationError.message);
                }); 
            }
            else {
                showErrorToast('Something went wrong!');
            }
            throw err;
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
            showErrorToast('Something went wrong');
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