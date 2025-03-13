import { StateCreator } from "zustand";
import {
    DashboardFilters,
    interview,

} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import {
  mockJobsAppliedForCompanies,
} from "../../mock data/seekerDashboard";
import{mockInterview}from "../../mock data/interviewDashboard";
import { formatDistanceToNow } from "date-fns";

export interface SeekerInterviewsSlice {
  seekerInterviewsData: interview[];
  seekerInterviewsPage: number;
  seekerInterviewsHasMore: boolean;
  seekerInterviewsIsLoading: boolean;
  seekerInterviewsFilters: DashboardFilters;
  seekerInterviewsCompanyNames: { value: string; label: string }[];
  seekerInterviewsFetchData: () => Promise<void>;
  seekerInterviewsSetFilters: (
    filters: Partial<SeekerInterviewsSlice["seekerInterviewsFilters"]>
  ) => Promise<void>;
  seekerInterviewsSetCompanyNames: () => Promise<void>;
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
  seekerInterviewsFilters: {
    country: "",
    city: "",
    status: "",
    phase: "",
    sortBy: "",
    company: "",
  },
  seekerInterviewsCompanyNames: [],

  seekerInterviewsFetchData: async () => {
    const {
      seekerInterviewsPage,
      seekerInterviewsHasMore,
      seekerInterviewsIsLoading,
    } = get();
    if (!seekerInterviewsHasMore || seekerInterviewsIsLoading) return;
    set({ seekerInterviewsIsLoading: true });

    // Mock API call, don't forget to include the filters in the query string if they are populated
    try {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          const startIndex = (seekerInterviewsPage - 1) * 5;
          const endIndex = startIndex + 5;
          const newRows = mockInterview.slice(startIndex, endIndex);

          set((state) => ({
            seekerInterviewsData: [
              ...state.seekerInterviewsData,
              ...newRows.map((job) => ({
                ...job,
                dateApplied: formatDistanceToNow(new Date(job.date), {
                  addSuffix: true,
                }),
              })),
            ],
            seekerInterviewsHasMore: endIndex < mockInterview.length,
            seekerInterviewsIsLoading: false,
            seekerInterviewsPage: state.seekerInterviewsPage + 1,
          }));
          resolve();
        }, 500)
      );
    } catch (err) {
      set({ seekerInterviewsIsLoading: false });
    }
  },

  seekerInterviewsSetCompanyNames: async () => {
    set({
      seekerInterviewsCompanyNames: [
        { value: "", label: "Any" },
        ...mockJobsAppliedForCompanies.map((company) => ({
          value: company,
          label: company,
        })),
      ],
    });
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
    }));

    await get().seekerInterviewsFetchData();
  },
});