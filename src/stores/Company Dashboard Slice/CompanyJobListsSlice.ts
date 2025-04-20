import { StateCreator, useStore } from 'zustand';
import { Job as CompanyJobList, CompanyJobListFilters, JobDetails } from '../../types/job';
import { mockDetailedJobs, mockJobs } from "../../mock data/seekerForYou";
import { mockCompanyIndustries } from '../../mock data/seekerCompanies';
import { CombinedState } from '../storeTypes';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import config from '../../../config/config.ts';
const API_BASE_URL = config.API_BASE_URL;


export interface CompanyJobListSlice {
    companyJobs: CompanyJobList[];
    companyJobsPage: number;
    companyJobsHasMore: boolean;
    companyJobsIsJobsLoading: boolean;
    companyJobsFilters: CompanyJobListFilters;
    jobTitleList: string[];
    companyTabSelectJobId: number | null;

    
    companyFetchJobs: () => Promise<void>;
    companyUpdateJobs: (id: number, title:string, country:string, city:string, datePosted:string) => Promise<void>
    companyDeleteJobs: (id: number) => Promise<void>
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
        const { companyJobsHasMore, companyJobsIsJobsLoading, companyJobsPage, companyJobsFilters } = get();
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
            const { userId } = get();
            console.log(userId)
            let res = await axios.get(`${config.API_BASE_URL}/companies/${userId}/jobs`, { params });
            console.log(res.data);
            console.log("here")

            // First update with basic job data
            set((state: CombinedState) => ({
                companyJobs: [
                    ...state.companyJobs,
                    ...res.data.map((apiJob: any) => ({
                        id: apiJob.id,
                        title: apiJob.title,
                        country: apiJob.country,
                        city: apiJob.city || undefined,
                        datePosted: formatDistanceToNow(new Date(apiJob.createdAt), { addSuffix: true }),
                        companyData: {
                            id: apiJob.companyId,
                            name: apiJob.companyName,
                            rating: apiJob.companyRating,
                            image: `${config.API_BASE_URL}/companies/${userId}/image` // Will be updated later
                        }
                    }))
                ],
                companyJobsHasMore: res.data.length > 0,
                companyJobsIsJobsLoading: false,
                companyJobsPage: state.companyJobsPage + 1,
            }));

            console.log('here1')

        } catch (err) {
            set({ CompanyCandidatesIsLoading: false });
        }

    },
    companyUpdateJobs: async (id, title, country, city, datePosted) => {
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

    companyDeleteJobs: async (jobId) => {
        const { companyJobs } = get();
        set({ companyJobsIsJobsLoading: true });

        try {
            // API call to delete the job
            await axios.patch(
                `${config.API_BASE_URL}/jobs/${jobId}`
            );

            // Update the local state by removing the deleted job
            // set({
            //     companyJobs: companyJobs.filter(job => job.id !== jobId),
            //     companyJobsIsJobsLoading: false
            // });
        } catch (err) {
            set({ companyJobsIsJobsLoading: false });
            throw err; // Re-throw the error for handling in the component
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