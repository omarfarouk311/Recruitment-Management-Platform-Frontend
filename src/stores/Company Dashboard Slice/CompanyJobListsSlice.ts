import { StateCreator } from 'zustand';
import { Job, CompanyJobListFilters } from '../../types/job';
import { CombinedState } from '../storeTypes';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import config from '../../../config/config.ts';
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

export interface CompanyJobListSlice {
    companyJobs: Job[];
    companyJobsPage: number;
    companyJobsHasMore: boolean;
    companyJobsIsJobsLoading: boolean;
    companyJobsFilters: CompanyJobListFilters;
    jobTitleList: string[];
    companyTabSelectJobId: number | null;

    companyFetchJobs: () => Promise<void>;
    companyUpdateJob: (id: number, title: string, country: string, city: string, datePosted: string) => Promise<void>
    companyCloseJob: (id: number) => Promise<void>
    companyTabSetSelectedJobId: (id: number) => Promise<void>;

    companyJobsSetFilters: (filters: Partial<CompanyJobListFilters>) => Promise<void>;
    jobListClear: () => void;
}

export const createcompanyJobsSlice: StateCreator<CombinedState, [], [], CompanyJobListSlice> = (set, get) => ({
    companyJobs: [],
    companyJobsPage: 1,
    companyJobsHasMore: true,
    companyJobsIsJobsLoading: false,
    companyJobsFilters: {
        jobs: {
            id: 0,
            jobTitle: "",
        },
        sortBy: ""
    },
    jobTitleList: [],
    companyTabSelectJobId: null,

    companyFetchJobs: async () => {
        const { companyJobsHasMore, companyJobsIsJobsLoading, companyJobsPage, companyJobsFilters, userId } = get();
        if (!companyJobsHasMore || companyJobsIsJobsLoading) return;

        set({ companyJobsIsJobsLoading: true });
        try {
            const params = {
                page: companyJobsPage,
                sortByDate: companyJobsFilters.sortBy,
                jobTitle: companyJobsFilters.jobs.jobTitle,
            }

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }

            const res = await axios.get(`${config.API_BASE_URL}/companies/${userId}/jobs`, { params });
            const newJobs: Job[] = res.data.map((job: any) => ({
                id: job.id,
                title: job.title,
                country: job.country,
                city: job.city,
                datePosted: formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }),
                closed: job.closed,
                companyData: {
                    id: job.companyId,
                    name: job.companyName,
                    rating: job.companyRating,
                    image: `${config.API_BASE_URL}/companies/${userId}/image`,
                }
            }));

            set((state) => ({
                companyJobs: [...state.companyJobs, ...newJobs],
                companyJobsHasMore: res.data.length === config.paginationLimit,
                companyJobsPage: state.companyJobsPage + 1,
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().companyFetchJobs();
                    }
                }
                else {
                    showErrorToast("Error while fetching jobs");
                }
            }
        }
        finally {
            set({ companyJobsIsJobsLoading: false });
        }
    },

    companyUpdateJob: async (id, title, country, city, datePosted) => {
        // const { companyJobs } = get();
        // set({ companyJobsIsJobsLoading: true });

        // try {
        //     // API call to update the job
        //     const res = await axios.put(
        //         `${config.API_BASE_URL}/companies/jobs/${jobId}`,
        //         updatedData
        //     );

        //     // Update the local state
        //     set({
        //         companyJobs: companyJobs.map(job =>
        //             job.id === jobId ? { ...job, ...res.data } : job
        //         ),
        //         companyJobsIsJobsLoading: false
        //     });

        //     return res.data; // Return the updated job if needed
        // } catch (err) {
        //     set({ companyJobsIsJobsLoading: false });
        //     throw err; // Re-throw the error for handling in the component
        // }
    },

    companyCloseJob: async (jobId) => {
        try {
            await axios.patch(`${config.API_BASE_URL}/jobs/${jobId}`);
            set((state) => ({
                companyJobs: state.companyJobs.map((job) =>
                    job.id === jobId ? { ...job, closed: true } : job
                )
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().companyCloseJob(jobId);
                    }
                }
                else {
                    showErrorToast("Error while deleting the job");
                }
            }
        }
    },

    companyJobsSetFilters: async (filters) => {
        set((state) => ({
            companyJobsFilters: { ...state.companyJobsFilters, ...filters },
            companyJobs: [],
            companyJobsPage: 1,
            companyJobsIsJobsLoading: false,
            companyJobsHasMore: true,
        }));

        await get().companyFetchJobs();
    },

    jobListClear: () => {
        set({
            companyJobs: [],
            companyJobsPage: 1,
            companyJobsHasMore: true,
            companyJobsIsJobsLoading: false,
            companyJobsFilters: {
                jobs: {
                    id: 0,
                    jobTitle: "",
                },
                sortBy: ""
            },
            jobTitleList: [],
            companyTabSelectJobId: null,
        });
    },

    companyTabSetSelectedJobId: async (id) => {
        if (id === get().forYouTabSelectedJobId) return;
        set({ companyTabSelectJobId: id });
    }
});