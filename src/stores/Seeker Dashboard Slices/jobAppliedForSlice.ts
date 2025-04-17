import { StateCreator } from "zustand";
import {
  JobsAppliedFor,
  JobsAppliedForFilters,
} from "../../types/seekerDashboard";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";

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
    sortBy: "",
    company: "",
  },
  seekerJobsAppliedForCompanyNames: [],

  seekerJobsAppliedForFetchData: async () => {
    const {
      seekerJobsAppliedForPage,
      seekerJobsAppliedForHasMore,
      seekerJobsAppliedForIsLoading,
      seekerJobsAppliedForFilters: { remote, country, city, status, sortBy, company },
    } = get();
    if (!seekerJobsAppliedForHasMore || seekerJobsAppliedForIsLoading) return;
    set({ seekerJobsAppliedForIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated
    try {
      let params = Object.fromEntries(
        Object.entries({
          page: seekerJobsAppliedForPage,
          remote: remote ? "true" : undefined,
          country: country || undefined,
          city: city || undefined,
          status: status == "3" ? "rejected" : (status == "2" ? "accepted" : undefined),
          companyName: company || undefined,
          sortByDate: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
          sortByStatusUpdate: Math.abs(parseInt(sortBy)) === 2 ? parseInt(sortBy) / 2 : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      let res = await axios.get(`${config.API_BASE_URL}/seekers/jobs-applied-for`, {
        params,
      });
      set((state) => ({
        seekerJobsAppliedForData: [
          ...state.seekerJobsAppliedForData,
          ...res.data.map((job: JobsAppliedFor) => ({
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
        seekerJobsAppliedForHasMore:  res.data.length > 0,
        seekerJobsAppliedForIsLoading: false,
        seekerJobsAppliedForPage: state.seekerJobsAppliedForPage + 1,
      }));
    } catch (err) {
      set({ seekerJobsAppliedForIsLoading: false });
    }
  },

  seekerJobsAppliedForSetCompanyNames: async () => {
    let res = await axios.get(`${config.API_BASE_URL}/seekers/jobs-applied-for/companies-filter`);
    if(res.status !== 200) return;
    set({
      seekerJobsAppliedForCompanyNames: [
        ...res.data.map((company: string) => ({
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
        sortBy: "",
        company: "",
      },
      seekerJobsAppliedForCompanyNames: [],
    });
  },
});
