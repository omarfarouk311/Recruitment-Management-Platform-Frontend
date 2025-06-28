import { StateCreator } from "zustand";
import {
  assessment,
  DashboardFilters
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

export interface SeekerAssessmentsSlice {
  seekerAssessmentsData: assessment[];
  seekerAssessmentsPage: number;
  seekerAssessmentsHasMore: boolean;
  seekerAssessmentsIsLoading: boolean;
  seekerAssessmentsFilters: DashboardFilters;
  seekerAssessmentsCompanyNames: { value: string; label: string }[];
  seekerAssessmentsError: string | null;
  seekerAssessmentsSetError: (error: string | null) => void;
  seekerAssessmentsFetchData: () => Promise<void>;
  seekerAssessmentsSetFilters: (
    filters: Partial<SeekerAssessmentsSlice["seekerAssessmentsFilters"]>
  ) => Promise<void>;
  seekerAssessmentsSetCompanyNames: () => Promise<void>;
  clearSeekerAssessment: () => void;
}

export const createSeekerAssessmentsSlice: StateCreator<
  CombinedState,
  [],
  [],
  SeekerAssessmentsSlice
> = (set, get, _api) => ({
  seekerAssessmentsData: [],
  seekerAssessmentsPage: 1,
  seekerAssessmentsError: null,
  seekerAssessmentsHasMore: true,
  seekerAssessmentsIsLoading: false,
  seekerAssessmentsFilters: {
    country: "",
    city: "",
    status: "",
    sortBy: "",
    company: "",
  },
  seekerAssessmentsCompanyNames: [],

  seekerAssessmentsFetchData: async () => {
    const {
      seekerAssessmentsPage,
      seekerAssessmentsHasMore,
      seekerAssessmentsIsLoading,
      seekerAssessmentsFilters: { country, city, status, company, sortBy }
    } = get();
    
    if (!seekerAssessmentsHasMore || seekerAssessmentsIsLoading) return;
    
    set({ 
      seekerAssessmentsIsLoading: true,
      seekerAssessmentsError: null 
    });

    try {
      let params = Object.fromEntries(
        Object.entries({
          page: seekerAssessmentsPage,
          country: country || undefined,
          city: city || undefined,
          companyName: company || undefined,
          sorted: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      const response = await axios.get(
        `${config.API_BASE_URL}/assessments/seeker-assessment-dashboard`, 
        {
          params,
          withCredentials: true
        }
      );
      
      set((state) => ({
        seekerAssessmentsData: [
          ...state.seekerAssessmentsData,
          ...response.data.result.map((a: any) => ({
            assessmentId: a.assessment_id,
            jobTitle: a.title,
            jobId: a.jobid,
            companyName: a.name,
            companyId: a.companyid,
            country: a.country,
            city: a.city,
            assessmentTime: a.assessment_time,
            dateAdded: formatDistanceToNow(new Date(a.date_applied), { addSuffix: true }),
            deadline: a.phase_deadline,
            status: a.status,
          })),
        ],
        seekerAssessmentsHasMore: response.data.length === config.paginationLimit,
        seekerAssessmentsIsLoading: false,
        seekerAssessmentsPage: state.seekerAssessmentsPage + 1,
      }));

    } catch (err) {
      set({ seekerAssessmentsIsLoading: false });
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().seekerAssessmentsFetchData();
          } else {
            set({ seekerAssessmentsError: "Session expired. Please login again." });
          }
        } else {
          set({ seekerAssessmentsError: "Failed to fetch assessments data" });
          showErrorToast('Failed to fetch assessments data');
        }
      } else {
        set({ seekerAssessmentsError: "An unexpected error occurred" });
        showErrorToast('An unexpected error occurred');
      }
    }
  },

  seekerAssessmentsSetCompanyNames: async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/seekers/jobs-applied-for/companies-filter`,
        { withCredentials: true }
      );
      
      if (response.status !== 200) return;
      
      set({
        seekerAssessmentsCompanyNames: [
          ...response.data.map((company: string) => ({
            value: company,
            label: company,
          })),
        ],
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().seekerAssessmentsSetCompanyNames();
          } else {
            set({ seekerAssessmentsError: "Session expired. Please login again." });
          }
        } else {
          set({ seekerAssessmentsError: "Failed to fetch company names" });
          showErrorToast('Failed to fetch company names');
        }
      }
    }
  },

  seekerAssessmentsSetFilters: async (filters) => {
    set((state) => ({
      seekerAssessmentsFilters: {
        ...state.seekerAssessmentsFilters,
        ...filters,
      },
      seekerAssessmentsData: [],
      seekerAssessmentsPage: 1,
      seekerAssessmentsHasMore: true,
      seekerAssessmentsError: null,
    }));

    await get().seekerAssessmentsFetchData();
  },
  
  seekerAssessmentsSetError: (error: string | null) => {
    set({ seekerAssessmentsError: error });
  },
  
  clearSeekerAssessment: () => {
    set({
      seekerAssessmentsData: [],
      seekerAssessmentsPage: 1,
      seekerAssessmentsHasMore: true,
      seekerAssessmentsIsLoading: false,
      seekerAssessmentsFilters: {
        country: "",
        city: "",
        status: "",
        sortBy: "",
        company: "",
      },
      seekerAssessmentsCompanyNames: [],
      seekerAssessmentsError: null,
    });
  },
});