import { StateCreator } from "zustand";
import {
  DashboardFilters,
  interview
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config.ts";
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

export interface SeekerInterviewsSlice {
  seekerInterviewsData: interview[];
  seekerInterviewsPage: number;
  seekerInterviewsHasMore: boolean;
  seekerInterviewsIsLoading: boolean;
  seekerInterviewsError: string | null;
  seekerInterviewsFilters: DashboardFilters;
  seekerInterviewsCompanyNames: { value: string; label: string }[];
  seekerInterviewsFetchData: () => Promise<void>;
  seekerInterviewsSetFilters: (
    filters: Partial<SeekerInterviewsSlice["seekerInterviewsFilters"]>
  ) => Promise<void>;
  seekerInterviewsSetCompanyNames: () => Promise<void>;
  clearSeekerInterviews: () => void;
  seekerInterviewsSetError: (error: string | null) => void;
}

export const createSeekerInterviewsSlice: StateCreator<
  CombinedState,
  [],
  [],
  SeekerInterviewsSlice
> = (set, get, _api) => ({
  seekerInterviewsData: [],
  seekerInterviewsPage: 1,
  seekerInterviewsHasMore: true,
  seekerInterviewsIsLoading: false,
  seekerInterviewsError: null,
  seekerInterviewsFilters: {
    country: "",
    city: "",
    status: "",
    sortBy: "",
    company: "",
  },
  seekerInterviewsCompanyNames: [],

  seekerInterviewsFetchData: async () => {
    const {
      seekerInterviewsPage,
      seekerInterviewsHasMore,
      seekerInterviewsIsLoading,
      seekerInterviewsFilters: { country, city, status, company, sortBy }
    } = get();

    if (!seekerInterviewsHasMore || seekerInterviewsIsLoading) return;

    set({ 
      seekerInterviewsIsLoading: true,
      seekerInterviewsError: null 
    });

    try {
      let params = Object.fromEntries(
        Object.entries({
          page: seekerInterviewsPage,
          country: country || undefined,
          city: city || undefined,
          companyName: company || undefined,
          sortByDate: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      const response = await axios.get(`${config.API_BASE_URL}/interviews/seeker`, {
        params,
        withCredentials: true
      });

      set((state) => ({
        seekerInterviewsData: [
          ...state.seekerInterviewsData,
          ...response.data.interviews.map((i: any) => ({
            recruiter: i.recruitername ?? "------",
            jobTitle: i.job_title,
            jobId: i.job_id,
            companyName: i.companyname,
            companyId: i.company_id,
            country: i.location,
            city: i.job_city,
            date: i.deadline,
            meetingLink: i.meetingLink ?? "",
          })),
        ],
        seekerInterviewsHasMore: response.data.length === config.paginationLimit,
        seekerInterviewsIsLoading: false,
        seekerInterviewsPage: state.seekerInterviewsPage + 1,
      }));
    } catch (err) {
      set({ seekerInterviewsIsLoading: false });
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().seekerInterviewsFetchData();
          } else {
            set({ seekerInterviewsError: "Session expired. Please login again." });
          }
        } else {
          set({ seekerInterviewsError: "Failed to fetch interviews data" });
          showErrorToast('Failed to fetch interviews data');
        }
      } else {
        set({ seekerInterviewsError: "An unexpected error occurred" });
        showErrorToast('An unexpected error occurred');
      }
    }
  },

  seekerInterviewsSetCompanyNames: async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/seekers/jobs-applied-for/companies-filter`,
        { withCredentials: true }
      );

      set({
        seekerInterviewsCompanyNames: response.data.map((company: string) => ({
          value: company,
          label: company,
        })),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().seekerInterviewsSetCompanyNames();
          } else {
            set({ seekerInterviewsError: "Session expired. Please login again." });
          }
        } else {
          set({ seekerInterviewsError: "Failed to fetch company names" });
          showErrorToast('Failed to fetch company names');
        }
      }
    }
  },

  seekerInterviewsSetFilters: async (filters) => {
    set((state) => ({
      seekerInterviewsFilters: {
        ...state.seekerInterviewsFilters,
        ...filters,
      },
      seekerInterviewsData: [],
      seekerInterviewsPage: 1,
      seekerInterviewsHasMore: true,
      seekerInterviewsError: null,
    }));

    await get().seekerInterviewsFetchData();
  },

  clearSeekerInterviews: () => {
    set({
      seekerInterviewsData: [],
      seekerInterviewsPage: 1,
      seekerInterviewsHasMore: true,
      seekerInterviewsIsLoading: false,
      seekerInterviewsError: null,
      seekerInterviewsFilters: {
        country: "",
        city: "",
        status: "",
        sortBy: "",
        company: "",
      },
      seekerInterviewsCompanyNames: [],
    });
  },

  seekerInterviewsSetError: (error: string | null) => {
    set({ seekerInterviewsError: error });
  },
});