import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Interviews, DashboardInterviewsFilters, updateInterviewDate } from "../../types/recruiterDashboard";
import axios from 'axios';
import config from '../../../config/config.ts';
const API_BASE_URL = config.API_BASE_URL;

export interface RecruiterInterviewsSlice {
    recruiterJobTitles: string[];
    recruiterInterviewsData: Interviews[];
    recruiterInterviewsPage: number;
    recruiterInterviewsHasMore: boolean;
    recruiterInterviewsIsLoading: boolean;
    recruiterInterviewsFilters: DashboardInterviewsFilters;
    recruiterInterviewsUpateDate: updateInterviewDate;
    recruiterInterviewsSetUpateDate: (date: updateInterviewDate) => Promise<void>;
    recruiterInterviewsFetchData: () => Promise<void>;
    recruiterInterviewsSetFilters: (filters: Partial<RecruiterInterviewsSlice['recruiterInterviewsFilters']>) => void;
    resetAllData: () => void;
}


export const createInterviewsSlice: StateCreator<
    CombinedState,
    [],
    [],
    RecruiterInterviewsSlice
    > = (set, get) => ({
    recruiterJobTitles: [],
    recruiterInterviewsData: [],
    recruiterInterviewsPage: 1,
    recruiterInterviewsHasMore: true,
    recruiterInterviewsIsLoading: false,
    recruiterInterviewsFilters: {
        sortByDate: "", // Sort by Date (Ascending/Descending)
        jobTitle: "",
    },
    recruiterInterviewsUpateDate: {
        jobId: 0,
        date: "",
    },
    resetAllData: () => {
        set({
            recruiterJobTitles: [],
            recruiterInterviewsData: [],
            recruiterInterviewsPage: 1,
            recruiterInterviewsHasMore: true,
            recruiterInterviewsIsLoading: false,
            recruiterInterviewsFilters: {
                sortByDate: "",
                jobTitle: "",
            },
            recruiterInterviewsUpateDate: {
                jobId: 0,
                date: "",
            },
        });
    },
    recruiterInterviewsSetUpateDate: async ({ jobId, date }) => {
        const { recruiterInterviewsData } = get();
        const updatedData = recruiterInterviewsData.map((interview) => {
            if (interview.jobId === jobId) {
                return { ...interview, date };
            }
            return interview;
        });
        set({ recruiterInterviewsData: updatedData });
    },
    // Fetch data function
    recruiterInterviewsFetchData: async () => {
        const {
            recruiterInterviewsPage,
            recruiterInterviewsHasMore,
            recruiterInterviewsIsLoading,
            recruiterInterviewsFilters,
        } = get();

        // Return early if no more data or already loading
        if (!recruiterInterviewsHasMore || recruiterInterviewsIsLoading) return;

        set({ recruiterInterviewsIsLoading: true });

        try {

            // Make API call with filters and pagination
            const jobTitles = await axios.get(`${API_BASE_URL}/candidates/job-title-filter`)
            set(() => ({
                recruiterJobTitles: jobTitles.data.jobTitle
            }))
            const response = await axios.get(`${API_BASE_URL}/interviews`, {
                params: Object.fromEntries(
                    Object.entries({
                        page: recruiterInterviewsPage,
                        sort: recruiterInterviewsFilters.sortByDate,
                        title: recruiterInterviewsFilters.jobTitle
                    }).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                ),
            });
            const newRows = response.data.interviews;
            const hasMore = response.data.length > 0;
            set((state) => ({
                recruiterInterviewsData: [
                    ...state.recruiterInterviewsData, // Existing data after
                    ...newRows, // New data from API

                ],
                recruiterInterviewsHasMore: hasMore,
                recruiterInterviewsIsLoading: false,
                recruiterInterviewsPage: state.recruiterInterviewsPage + 1,
            }));    
        } catch (err) {
            set({ recruiterInterviewsIsLoading: false });
        }
    },

    // Set filters function
        recruiterInterviewsSetFilters: (filters) => {
        console.log(filters)
        set((state) => ({
            recruiterInterviewsFilters: { ...state.recruiterInterviewsFilters, ...filters },
            recruiterInterviewsData: [], // Reset data when filters change
            recruiterInterviewsPage: 1, // Reset pagination
            recruiterInterviewsHasMore: true, // Reset hasMore flag
        }));

        // Fetch new data after updating filters
        get().recruiterInterviewsFetchData();
    },

});