import { StateCreator } from "zustand";
import {
  JobsAppliedFor,
  JobsAppliedForFilters,
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import {
  mockJobsAppliedFor,
  mockJobsAppliedForCompanies,
} from "../../mock data/seekerDashboard";
import { formatDistanceToNow } from "date-fns";

export interface SeekerJobsAppliedForSlice {
  seekerJobsAppliedForData: JobsAppliedFor[];
  seekerJobsAppliedForPage: number;
  seekerJobsAppliedForHasMore: boolean;
  seekerJobsAppliedForIsLoading: boolean;
  seekerJobsAppliedForFilters: JobsAppliedForFilters;
  seekerJobsAppliedForCompanyNames: { value: string; label: string }[];
  seekerJobsAppliedForFetchData: () => Promise<void>;
  seekerJobsAppliedForSetFilters: (
    filters: Partial<SeekerJobsAppliedForSlice["seekerJobsAppliedForFilters"]>
  ) => Promise<void>;
  seekerJobsAppliedForSetCompanyNames: () => Promise<void>;
  clearSeekerJobsAppliedFor: () => void;
}

export const createSeekerJobsAppliedForSlice: StateCreator<
  CombinedState,
  [],
  [],
  SeekerJobsAppliedForSlice
> = (set, get, _api) => ({
  seekerJobsAppliedForData: [],
  seekerJobsAppliedForPage: 1,
  seekerJobsAppliedForHasMore: true,
  seekerJobsAppliedForIsLoading: false,
  seekerJobsAppliedForFilters: {
    remote: false,
    country: "",
    city: "",
    status: "",
    phase: "",
    sortBy: "",
    company: "",
  },
  seekerJobsAppliedForCompanyNames: [],

  seekerJobsAppliedForFetchData: async () => {
    const {
      seekerJobsAppliedForPage,
      seekerJobsAppliedForHasMore,
      seekerJobsAppliedForIsLoading,
    } = get();
    if (!seekerJobsAppliedForHasMore || seekerJobsAppliedForIsLoading) return;
    set({ seekerJobsAppliedForIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated
    try {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          const startIndex = (seekerJobsAppliedForPage - 1) * 5;
          const endIndex = startIndex + 5;
          const newRows = mockJobsAppliedFor.slice(startIndex, endIndex);

          set((state) => ({
            seekerJobsAppliedForData: [
              ...state.seekerJobsAppliedForData,
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
            seekerJobsAppliedForHasMore: endIndex < mockJobsAppliedFor.length,
            seekerJobsAppliedForIsLoading: false,
            seekerJobsAppliedForPage: state.seekerJobsAppliedForPage + 1,
          }));
          resolve();
        }, 500)
      );
    } catch (err) {
      set({ seekerJobsAppliedForIsLoading: false });
    }
  },

  seekerJobsAppliedForSetCompanyNames: async () => {
    set({
      seekerJobsAppliedForCompanyNames: [
        { value: "", label: "Any" },
        ...mockJobsAppliedForCompanies.map((company) => ({
          value: company,
          label: company,
        })),
      ],
    });
  },

  seekerJobsAppliedForSetFilters: async (filters) => {
    set((state) => ({
      seekerJobsAppliedForFilters: {
        ...state.seekerJobsAppliedForFilters,
        ...filters,
      },
      seekerJobsAppliedForData: [],
      seekerJobsAppliedForPage: 1,
      seekerJobsAppliedForHasMore: true,
    }));

    await get().seekerJobsAppliedForFetchData();
  },

  clearSeekerJobsAppliedFor: () => {
    set({
      seekerJobsAppliedForData: [],
      seekerJobsAppliedForPage: 1,
      seekerJobsAppliedForHasMore: true,
      seekerJobsAppliedForIsLoading: false,
      seekerJobsAppliedForFilters: {
        remote: false,
        country: "",
        city: "",
        status: "",
        phase: "",
        sortBy: "",
        company: "",
      },
      seekerJobsAppliedForCompanyNames: [],
    });
  },
});
