import { StateCreator } from "zustand";
import {
  assessment,
  DashboardFilters
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";

export interface SeekerAssessmentsSlice {
  seekerAssessmentsData: assessment[];
  seekerAssessmentsPage: number;
  seekerAssessmentsHasMore: boolean;
  seekerAssessmentsIsLoading: boolean;
  seekerAssessmentsFilters: DashboardFilters;
  seekerAssessmentsCompanyNames: { value: string; label: string }[];
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
      seekerAssessmentsFilters:{country,city,status,company,sortBy}
    } = get();
    if (!seekerAssessmentsHasMore || seekerAssessmentsIsLoading) return;
    set({ seekerAssessmentsIsLoading: true });

    // Mock API call, don't forget to include the filters in the query string if they are populated

    try {
      let params = Object.fromEntries(
        Object.entries({
          page: seekerAssessmentsPage,
          country: country || undefined,
          city: city || undefined,
          status: status == "3" ? "rejected" : (status == "2" ? "accepted" : undefined),
          companyName: company || undefined,
          sortByDate: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      let res = await axios.get(`${config.API_BASE_URL}/assessments/seeker-assessment-dashboard`, {
        params,
      });
      
      set((state) => ({
        seekerAssessmentsData: [
          ...state.seekerAssessmentsData,
          ...res.data.result.map((a: any) => ({
            assessmentId: a.assessment_id,
            jobTitle: a.title,
            jobId: a.jobid,
            companyName: a.name,
            companyId: a.companyid,
            country: a.country,
            city: a.city,
            assessmentTime:a.assessment_time,
            dateAdded:formatDistanceToNow(new Date(a.date_applied), { addSuffix: true }),
            deadline: a.phase_deadline,
            status: a.status,
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

  seekerAssessmentsSetCompanyNames: async () => {
    let res = await axios.get(`${config.API_BASE_URL}/seekers/jobs-applied-for/companies-filter`);
    if(res.status !== 200) return;
    set({
      seekerAssessmentsCompanyNames: [
        ...res.data.map((company:string) => ({
          value: company,
          label: company,
        })),
      ],
    });
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
    }));

    await get().seekerAssessmentsFetchData();
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
    });
  },
});