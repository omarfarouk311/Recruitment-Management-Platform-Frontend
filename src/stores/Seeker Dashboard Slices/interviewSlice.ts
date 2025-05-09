import { StateCreator } from "zustand";
import {
  DashboardFilters,
  interview
} from "../../types/seekerDashboard";

import { CombinedState } from "../storeTypes";

import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";

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
  clearSeekerInterviews: () => void;
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

    set({ seekerInterviewsIsLoading: true });

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

      const res = await axios.get(`${config.API_BASE_URL}/interviews/seeker`, {
        params,
      });
    console.log(res.data)
      if (res.status!== 200) return;
      set((state) => ({
        seekerInterviewsData: [
          ...state.seekerInterviewsData,
          ...res.data.interviews.map((i: any) => ({
            recruiter:i.recruitername,
            jobTitle: i.job_title,
            jobId: i.job_id,
            companyName: i.companyname,
            companyId: i.company_id,
            country: i.location,
            city: i.city,
            date: formatDistanceToNow(new Date(i.deadline), { addSuffix: true }),
            meetingLink: i.meetingLink,
          })),
        ],
        seekerInterviewsHasMore: res.data.length > 0,
        seekerInterviewsIsLoading: false,
        seekerInterviewsPage: state.seekerInterviewsPage + 1,
      }));
    } catch (err) {
      set({ seekerInterviewsIsLoading: false });
    }
  },

  seekerInterviewsSetCompanyNames: async () => {
    const res = await axios.get(`${config.API_BASE_URL}/seekers/jobs-applied-for/companies-filter`);
    if (res.status !== 200) return;

    set({
      seekerInterviewsCompanyNames: res.data.map((company: string) => ({
        value: company,
        label: company,
      })),
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

  clearSeekerInterviews: () => {
    set({
      seekerInterviewsData: [],
      seekerInterviewsPage: 1,
      seekerInterviewsHasMore: true,
      seekerInterviewsIsLoading: false,
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
});
