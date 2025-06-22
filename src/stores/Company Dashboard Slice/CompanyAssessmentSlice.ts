import { StateCreator } from "zustand";
import { assessment, AssessmentFilters } from "../../types/companyDashboard.ts";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

export interface CompanyAssessmentsSlice {
  companyAssessmentsData: assessment[];
  companyAssessmentsPage: number;
  companyAssessmentsHasMore: boolean;
  companyAssessmentsIsLoading: boolean;
  companyAssessmentsFilters: AssessmentFilters;
  CompanyAssessmentsJobTitleNames: { value: string; label: string }[];
  companyAssessmentsError: string | null;
  companyAssessmentsSetError: (error: string | null) => void;
  companyAssessmentsSetJobTitlesNames: () => Promise<void>;
  companyAssessmentsFetchData: () => Promise<void>;
  companyAssessmentsSetFilters: (
    filters: Partial<CompanyAssessmentsSlice["companyAssessmentsFilters"]>
  ) => Promise<void>;
  clearCompanyAssessment: () => void;
}

export const createCompanyAssessmentsSlice: StateCreator<
  CombinedState,
  [],
  [],
  CompanyAssessmentsSlice
> = (set, get, _api) => ({
  companyAssessmentsData: [],
  companyAssessmentsPage: 1,
  companyAssessmentsHasMore: true,
  companyAssessmentsIsLoading: false,
  companyAssessmentsError: null,
  CompanyAssessmentsJobTitleNames: [],
  companyAssessmentsFilters: {
    jobTitle: ""
  },

  companyAssessmentsFetchData: async () => {
    const {
      companyAssessmentsPage,
      companyAssessmentsHasMore,
      companyAssessmentsIsLoading,
      companyAssessmentsFilters: { jobTitle }
    } = get();
    
    if (!companyAssessmentsHasMore ) return;
    
    set({ 
      companyAssessmentsIsLoading: true,
      companyAssessmentsError: null 
    });

    try {
      let params = Object.fromEntries(
        Object.entries({
          page: companyAssessmentsPage,
          jobTitle: jobTitle || undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      const response = await axios.get(
        `${config.API_BASE_URL}/assessments`, 
        {
          params,
          withCredentials: true
        }
      );
      
      set((state) => ({
        companyAssessmentsData: [
          ...state.companyAssessmentsData,
          ...response.data.assessments.map((a: any) => ({
            assessmentId: a.id,
            jobTitle: a.job_title,
            assessmentName: a.name,
            assessmentTime: a.assessment_time,
            numberOfQuestions: a.num_of_questions,
          })),
        ],
        companyAssessmentsHasMore: response.data.length > 0,
        companyAssessmentsIsLoading: false,
        companyAssessmentsPage: state.companyAssessmentsPage + 1,
      }));

    } catch (err) {
      set({ companyAssessmentsIsLoading: false });
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().companyAssessmentsFetchData();
          } else {
            set({ companyAssessmentsError: "Session expired. Please login again." });
          }
        } else {
          set({ companyAssessmentsError: "Failed to fetch assessments data" });
          showErrorToast('Failed to fetch assessments data');
        }
      } else {
        set({ companyAssessmentsError: "An unexpected error occurred" });
        showErrorToast('An unexpected error occurred');
      }
    }
  },

  companyAssessmentsSetJobTitlesNames: async () => {
    try {
      const { userId } = get();
      const response = await axios.get(
        `${config.API_BASE_URL}/companies/${userId}/jobs?page=1&filterBar=true`,
        { withCredentials: true }
      );
      
      if (response.status !== 200) return;
      
      set({
        CompanyAssessmentsJobTitleNames: response.data.map((job: { id: number; title: string }) => ({
          value: job.id,
          label: job.title,
        })),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) {
            await get().companyAssessmentsSetJobTitlesNames();
          } else {
            set({ companyAssessmentsError: "Session expired. Please login again." });
          }
        } else {
          set({ companyAssessmentsError: "Failed to fetch job titles" });
          showErrorToast('Failed to fetch job titles');
        }
      }
    }
  },

  companyAssessmentsSetFilters: async (filters) => {
    set((state) => ({
      companyAssessmentsFilters: {
        ...state.companyAssessmentsFilters,
        ...filters,
      },
      companyAssessmentsData: [],
      companyAssessmentsPage: 1,
      companyAssessmentsHasMore: true,
      companyAssessmentsError: null,
    }));

    await get().companyAssessmentsFetchData();
  },
  
  companyAssessmentsSetError: (error: string | null) => {
    set({ companyAssessmentsError: error });
  },
  
  clearCompanyAssessment: () => {
    set({
      companyAssessmentsData: [],
      companyAssessmentsPage: 1,
      companyAssessmentsHasMore: true,
      companyAssessmentsIsLoading: false,
      companyAssessmentsFilters: {
        jobTitle: ""
      },
      CompanyAssessmentsJobTitleNames: [],
      companyAssessmentsError: null,
    });
  },
});