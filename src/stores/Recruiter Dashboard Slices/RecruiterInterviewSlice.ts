import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Interviews, DashboardInterviewsFilters, updateInterviewDate } from "../../types/recruiterDashboard";
import axios from 'axios';
import config from '../../../config/config.ts';
const API_BASE_URL = config.API_BASE_URL;

import { authRefreshToken } from '../../util/authUtils.ts';

export interface RecruiterInterviewsSlice {
    recruiterJobTitles: string[];
    recruiterInterviewsData: Interviews[];
    recruiterInterviewsPage: number;
    recruiterInterviewsHasMore: boolean;
    recruiterInterviewsIsLoading: boolean;
    recruiterInterviewsFilters: DashboardInterviewsFilters;
    recruiterInterviewsUpateDate: updateInterviewDate;
    recruiterInterviewsSetUpateDate: (data: updateInterviewDate) => Promise<void>;
    recruiterInterviewsFetchData: () => Promise<void>;
    recruiterInterviewsSetFilters: (filters: Partial<RecruiterInterviewsSlice['recruiterInterviewsFilters']>) => void;
    resetAllData: () => void;
    recruiterInterviewsSetUpdateInterview: (jobId: number, candidateId: number, date: string, link: string) => Promise<void>;
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
        sortByDate: "",
        jobTitle: "",
    },
    recruiterInterviewsUpateDate: {
        jobId: 0,
        seekerId: 0,
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
            }
        });
    },

    recruiterInterviewsSetUpateDate: async ({ jobId, seekerId, date }) => {
        set({ recruiterInterviewsIsLoading: true });
        try {
            await axios.put(`${API_BASE_URL}/interviews/${jobId}/${seekerId}`, {
                timestamp: date
            }, {
                withCredentials: true
            });

            set((state) => ({
                recruiterInterviewsData: state.recruiterInterviewsData.map(interview =>
                    interview.jobId === jobId && interview.userId === seekerId
                        ? { ...interview, date: date }
                        : interview
                ),
                recruiterInterviewsIsLoading: false,    
            }));
        } catch (err) {
            set({ recruiterInterviewsIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().recruiterInterviewsSetUpateDate({ jobId, seekerId, date });
                    }
                }
            }
            console.error("Failed to update interview date:", err);
        }
    },

    recruiterInterviewsFetchData: async () => {
        const {
            recruiterInterviewsPage,
            recruiterInterviewsHasMore,
            recruiterInterviewsIsLoading,
            recruiterInterviewsFilters,
        } = get();

        if (!recruiterInterviewsHasMore || recruiterInterviewsIsLoading) return;

        set({ recruiterInterviewsIsLoading: true });

        try {
            // Fetch job titles
            const jobTitlesResponse = await axios.get(`${API_BASE_URL}/candidates/job-title-filter`, {
                withCredentials: true
            });
            
            set({ recruiterJobTitles: jobTitlesResponse.data.jobTitle });

            // Fetch interviews
            const response = await axios.get(`${API_BASE_URL}/interviews`, {
                params: Object.fromEntries(
                    Object.entries({
                        page: recruiterInterviewsPage,
                        sort: recruiterInterviewsFilters.sortByDate,
                        title: recruiterInterviewsFilters.jobTitle
                    }).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                ),
                withCredentials: true
            });

            const newRows = response.data.interviews;
            set((state) => ({
                recruiterInterviewsData: [...state.recruiterInterviewsData, ...newRows],
                recruiterInterviewsHasMore: newRows.length === config.paginationLimit,
                recruiterInterviewsIsLoading: false,
                recruiterInterviewsPage: state.recruiterInterviewsPage + 1,
            }));    
        } catch (err) {
            set({ recruiterInterviewsIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().recruiterInterviewsFetchData();
                    }
                }
            }
            console.error("Error fetching interviews:", err);
        }
    },

    recruiterInterviewsSetFilters: (filters) => {
        set((state) => ({
            recruiterInterviewsFilters: { ...state.recruiterInterviewsFilters, ...filters },
            recruiterInterviewsData: [],
            recruiterInterviewsPage: 1,
            recruiterInterviewsHasMore: true,
        }));

        get().recruiterInterviewsFetchData();
    },

    recruiterInterviewsSetUpdateInterview: async (jobId, seekerId, date, meetingLink) => {
        try {
            set({ recruiterInterviewsIsLoading: true });
            const { recruiterInterviewsData } = get();

            const currentInterview = recruiterInterviewsData.find(
                interview => interview.jobId === jobId && interview.userId === seekerId
            );

            const dateChanged = currentInterview?.date !== date;
            const linkChanged = currentInterview?.meetingLink !== meetingLink;

            if (dateChanged || linkChanged) {
                await axios.put(`${API_BASE_URL}/interviews/${jobId}/${seekerId}`, {
                    timestamp: date,
                    interviewLink: meetingLink
                }, {
                    withCredentials: true
                });

                set((state) => ({
                    recruiterInterviewsData: state.recruiterInterviewsData.map(interview =>
                        interview.jobId === jobId && interview.userId === seekerId
                            ? {
                                ...interview,
                                date: dateChanged ? date : interview.date,
                                meetingLink: linkChanged ? meetingLink : interview.meetingLink
                            }
                            : interview
                    ),
                    recruiterInterviewsIsLoading: false,
                }));
            } else {
                set({ recruiterInterviewsIsLoading: false });
            }
        } catch (err) {
            set({ recruiterInterviewsIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().recruiterInterviewsSetUpdateInterview(jobId, seekerId, date, meetingLink);
                    }
                }
            }
            console.error("Failed to update interview:", err);
        }
    }
});