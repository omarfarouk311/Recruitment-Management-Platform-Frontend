import { StateCreator } from 'zustand';
import { Job as CompanyJobList, CompanyJobListFilters, JobDetails } from '../../types/job';
import { mockDetailedJobs, mockJobs } from "../../mock data/seekerForYou";
import { mockCompanyIndustries } from '../../mock data/seekerCompanies';
import { CombinedState } from '../storeTypes';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import config from '../../../config/config.ts';
const API_BASE_URL = config.API_BASE_URL;

const { paginationLimit } = config;

/*
       useFetchJobs={useFetchJobs}
            useHasMore={useHasMore}
            useIsLoading={useIsLoading}
            useJobs={useJobs}
            useSelectedJobId={useSelectedJobId}
            useSetSelectedJobId={useSetSelectedJobId}
            useRemoveRecommendation={useRemoveRecommendation}
*/

export interface CompanyJobListSlice {
    companyJobs: CompanyJobList[];
    companyJobsPage: number;
    companyJobsHasMore: boolean;
    companyJobsIsJobsLoading: boolean;
    companyJobsFilters: CompanyJobListFilters; 
    jobTitleList: string[];
    companyTabSelectJobId: number | null;

    
    companyFetchJobs: () => Promise<void>;
    companyUpdateJobs: (id: number) => Promise<void>
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
            let res = await axios.get(
                `${config.API_BASE_URL}/companies/1/jobs`,
                { params }
            );
            console.log(res.data)
            set((state: CombinedState) => ({    
                companyJobs: [
                    ...state.companyJobs,
                    ...res.data.map((jobs: any) => ({
                        ...jobs,
                        datePosted: formatDistanceToNow(
                            new Date(jobs.createdAt),
                            { addSuffix: true }
                        ),
                    })),
                ],
                companyJobsHasMore: res.data.length > 0,
                companyJobsIsJobsLoading: false,
                companyJobsPage: state.companyJobsPage + 1,
            }));
            console.log("here")

        } catch (err) {
            set({ CompanyCandidatesIsLoading: false });
        }

    },
    companyUpdateJobs: async () => {
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
            set({
                companyJobs: companyJobs.filter(job => job.id !== jobId),
                companyJobsIsJobsLoading: false
            });
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