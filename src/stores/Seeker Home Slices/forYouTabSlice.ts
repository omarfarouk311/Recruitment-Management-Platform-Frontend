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
    forYouTabFetchCompanyIndustries: (id: number) => Promise<void>;
    forYouTabClear: () => void;
    forYouTabClearDetailedJobs: () => void;
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
            const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
            const response = res.data;

            const transformedDetails: JobDetails = {
                // Job Data
                id: response.jobData.id,
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

                similarJobs: []
            };

            console.log(transformedDetails);

            set({
                forYouTabDetailedJobs: [transformedDetails],
                forYouTabIsDetailsLoading: false
            });
        }
        catch (err) {
            console.error(err);
            set({ forYouTabIsDetailsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    showErrorToast('Job not found');
                } else if (err.response?.status === 500) {
                    showErrorToast('Something went wrong');
                }
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
    },

    forYouTabRemoveRecommendation: async (id: number) => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    forYouTabJobs: state.forYouTabJobs.filter((job) => job.id !== id)
                }));
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    },

    forYouTabApplyToJob: async (id, cvId) => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === id ? { ...job, applied: true } : job)
                }))
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    },

    forYouTabReportJob: async (id, message) => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === id ? { ...job, reported: true } : job)
                }));
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    },

    forYouTabFetchCompanyIndustries: async (id) => {
        if (get().forYouTabDetailedJobs.find((job) => job.id === id)?.companyData.industries.length) return;

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    forYouTabDetailedJobs: state.forYouTabDetailedJobs.map((job) => job.id === id ?
                        {
                            ...job,
                            companyData: { ...job.companyData, industries: [...mockCompanyIndustries] },
                            companyReviews: [...job.companyReviews],
                            similarJobs: [...job.similarJobs.map((job) => ({ ...job, companyData: { ...job.companyData } }))]
                        }
                        :
                        {
                            ...job,
                            companyData: { ...job.companyData, industries: [...job.companyData.industries] },
                            companyReviews: [...job.companyReviews],
                            similarJobs: [...job.similarJobs.map((job) => ({ ...job, companyData: { ...job.companyData } }))],
                        }
                    )
                }));
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
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