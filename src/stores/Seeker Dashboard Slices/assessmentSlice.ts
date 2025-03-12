import { StateCreator } from "zustand";
import {
  JobsAppliedFor,
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import {
  mockJobsAppliedFor,
  mockJobsAppliedForCompanies,
} from "../../mock data/seekerDashboard";
import { formatDistanceToNow } from "date-fns";

export interface AssessmentsFilters {
  remote: boolean;
  country: string;
  city: string;
  status: string;
  phase: string;
  sortBy: string;
  company: string;
}

export interface SeekerAssessmentsSlice {
  seekerAssessmentsData: JobsAppliedFor[];
  seekerAssessmentsPage: number;
  seekerAssessmentsHasMore: boolean;
  seekerAssessmentsIsLoading: boolean;
  seekerAssessmentsFilters: AssessmentsFilters;
  seekerAssessmentsCompanyNames: { value: string; label: string }[];
  seekerAssessmentsFetchData: () => Promise<void>;
  seekerAssessmentsSetFilters: (
    filters: Partial<SeekerAssessmentsSlice["seekerAssessmentsFilters"]>
  ) => Promise<void>;
  seekerAssessmentsSetCompanyNames: () => Promise<void>;
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
    remote: false,
    country: "",
    city: "",
    status: "",
    phase: "",
    sortBy: "",
    company: "",
  },
  seekerAssessmentsCompanyNames: [],

  seekerAssessmentsFetchData: async () => {
    const {
      seekerAssessmentsPage,
      seekerAssessmentsHasMore,
      seekerAssessmentsIsLoading,
    } = get();
    if (!seekerAssessmentsHasMore || seekerAssessmentsIsLoading) return;
    set({ seekerAssessmentsIsLoading: true });

    // Mock API call, don't forget to include the filters in the query string if they are populated
    try {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          const startIndex = (seekerAssessmentsPage - 1) * 5;
          const endIndex = startIndex + 5;
          const newRows = mockJobsAppliedFor.slice(startIndex, endIndex);

          set((state) => ({
            seekerAssessmentsData: [
              ...state.seekerAssessmentsData,
              ...newRows.map((job) => ({
                ...job,
                dateApplied: formatDistanceToNow(new Date(job.dateApplied), {
                  addSuffix: true,
                }),
                lastStatusUpdate: formatDistanceToNow(
                  new Date(job.lastStatusUpdate),
                  { addSuffix: true }
                ),
              })),
            ],
            seekerAssessmentsHasMore: endIndex < mockJobsAppliedFor.length,
            seekerAssessmentsIsLoading: false,
            seekerAssessmentsPage: state.seekerAssessmentsPage + 1,
          }));
          resolve();
        }, 500)
      );
    } catch (err) {
      set({ seekerAssessmentsIsLoading: false });
    }
  },

  seekerAssessmentsSetCompanyNames: async () => {
    set({
      seekerAssessmentsCompanyNames: [
        { value: "", label: "Any" },
        ...mockJobsAppliedForCompanies.map((company) => ({
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
});