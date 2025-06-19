import { StateCreator } from 'zustand';
import { Job, CompanyJobListFilters } from '../../types/job';
import { CombinedState } from '../storeTypes';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import config from '../../../config/config.ts';
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

interface jobData {
    jobTitle: string,
    jobDescription: string,
    processId: number,
    industryId: number,
    appliedCntLimit: number,
    country: string,
    city: string,
    remote: number,
    skills: {
        skillId: number,
        importance: number,
    }[]
};

export interface CompanyJobListSlice {
    companyJobs: Job[];
    companyJobsPage: number;
    companyJobsHasMore: boolean;
    companyJobsIsJobsLoading: boolean;
    companyJobsFilters: CompanyJobListFilters;
    jobTitleList: string[];
    companyTabSelectJobId: number | null;

    companyFetchJobs: () => Promise<void>;
    companyAddJob: (job: jobData) => Promise<void>;
    companyEditJob: (job: jobData, jobId: number) => Promise<void>;
    companyCloseJob: (id: number) => Promise<void>;
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
        const { companyJobsHasMore, companyJobsPage, companyJobsFilters, userId } = get();
        if (!companyJobsHasMore) return;

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

            const res = await axios.get(`${config.API_BASE_URL}/companies/${userId}/jobs`, { params, withCredentials: true });
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
                        return await get().companyFetchJobs();
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

    companyAddJob: async (job) => {
        try {
            await axios.post(`${config.API_BASE_URL}/jobs`, job, { withCredentials: true });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        return await get().companyAddJob(job);
                    }
                }
                else if (err.response?.status === 400) {
                    const validationErrors: string[] = err.response.data.validationErrors;
                    validationErrors.forEach((error) => {
                        showErrorToast(error);
                    });
                    throw err;
                }
                else {
                    showErrorToast("Error while creating the job");
                    throw err;
                }
            }
        }
    },

    companyEditJob: async (job, jobId) => {
        try {
            await axios.put(`${config.API_BASE_URL}/jobs/${jobId}`, job, { withCredentials: true });
            set((state) => ({
                companyJobs: state.companyJobs.map((j) =>
                    j.id === jobId ? {
                        ...j,
                        title: job.jobTitle,
                        description: job.jobDescription,
                        country: job.country,
                        city: job.city,
                    } : j
                )
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        return await get().companyEditJob(job, jobId);
                    }
                }
                else if (err.response?.status === 400) {
                    const validationErrors: string[] = err.response.data.validationErrors;
                    validationErrors.forEach((error) => {
                        showErrorToast(error);
                    });
                    throw err;
                }
                else {
                    showErrorToast("Error while editing the job");
                    throw err;
                }
            }
        }
    },

    companyCloseJob: async (jobId) => {
        try {
            await axios.patch(`${config.API_BASE_URL}/jobs/${jobId}`, {}, { withCredentials: true });
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
                        return await get().companyCloseJob(jobId);
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