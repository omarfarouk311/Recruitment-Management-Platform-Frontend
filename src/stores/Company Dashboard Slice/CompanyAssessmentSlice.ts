import { StateCreator } from "zustand";
import {
  assessment,
  AssessmentFilters
} from "../../types/companyDashboard.ts";

import { CombinedState } from "../storeTypes";

import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";


export interface CompanyAssessmentsSlice {
  companyAssessmentsData: assessment[];
  companyAssessmentsPage: number;
  companyAssessmentsHasMore: boolean;
  companyAssessmentsIsLoading: boolean;
  companyAssessmentsFilters: AssessmentFilters;

  CompanyAssessmentsJobTitleNames:{ value: string; label: string }[];
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
  CompanyAssessmentsJobTitleNames: [],
  companyAssessmentsFilters: {
    jobTitle: ""
  },

  companyAssessmentsFetchData: async () => {
    const {
      companyAssessmentsPage,
      companyAssessmentsHasMore,
      companyAssessmentsIsLoading,
      companyAssessmentsFilters:{jobTitle}
    } = get();
    if (!companyAssessmentsHasMore || companyAssessmentsIsLoading) return;
    set({ companyAssessmentsIsLoading: true });

    // Mock API call, don't forget to include the filters in the query string if they are populated
    try {
        let params = Object.fromEntries(
          Object.entries({
            page: companyAssessmentsPage,
            jobTitle: jobTitle || undefined,
          }).filter(([_, value]) => value !== undefined)
        );
  
        let res = await axios.get(`${config.API_BASE_URL}/assessments`, {
          params,
        });
        
        set((state) => ({
            companyAssessmentsData: [
            ...state.companyAssessmentsData,
            ...res.data.assessments.map((a: any) => ({
              assessmentId: a.id,
              jobTitle: a.job_title,
              assessmentName: a.name,
              assessmentTime:a.assessment_time,
              numberOfQuestions: a.num_of_questions,
            })),
          ],
          seekerAssessmentsHasMore:  res.data.length > 0,
          seekerAssessmentsIsLoading: false,
          seekerAssessmentsPage: state.seekerAssessmentsPage + 1,
        }));
  
      }catch (err) {
        set({ seekerAssessmentsIsLoading: false });
      }


  },
  companyAssessmentsSetJobTitlesNames: async () => {
    
    const { userId } = get();
    console.log(userId)
    let res = await axios.get(`${config.API_BASE_URL}/companies/${userId}/jobs?page=1&filterBar=true`);
    if(res.status !== 200) return;


    set({
        CompanyAssessmentsJobTitleNames: res.data.map((job: { id: number; title: string }) => ({
          value: job.id,
          label: job.title,
        })),
      });
    
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
    }));

    await get().companyAssessmentsFetchData();
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
    });
  },
});
