import { StateCreator } from "zustand";
import { Logs, LogsFilters } from "../../types/companyDashboard";
import { CombinedState } from "../storeTypes";
import { format } from "date-fns";

import axios from "axios";
import config from "../../../config/config.ts";
import { authRefreshToken } from "../../util/authUtils.ts";
import { showErrorToast } from "../../util/errorHandler.ts";

export interface CompanyLogsSlice {
  companyLogsData: Logs[];
  companyLogsPage: number;
  companyLogsHasMore: boolean;
  companyLogsIsLoading: boolean;
  companyLogsFilters: LogsFilters;
  companyLogsPerformedBy: {value: string, label: string}[];
  companyLogsActionType: {value: string, label: string}[];
  companyLogsFetchData: () => Promise<void>;
  companyLogsSetFilters: (
    sortBy: Partial<CompanyLogsSlice["companyLogsFilters"]>
  ) => Promise<void>;
  companyLogsSetPerformedBy: () => Promise<void>;
  companyLogsSetActionType: () => Promise<void>;
  companyLogsTabClear: () => void;
}

export const createCompanyLogsSlice: StateCreator<
  CombinedState,
  [],
  [],
  CompanyLogsSlice
> = (set, get) => ({
  companyLogsData: [],
  companyLogsPage: 1,
  companyLogsHasMore: true,
  companyLogsIsLoading: false,
  companyLogsFilters: {
    performedBy: "",
    date: "",
    action: "",
  },
  companyLogsPerformedBy: [],
  companyLogsActionType: [],

  companyLogsFetchData: async () => {
    const { companyLogsPage,
            companyLogsHasMore,
            companyLogsIsLoading, 
            companyLogsFilters: { performedBy,date, action },
     } = get();
    if (!companyLogsHasMore || companyLogsIsLoading) return;
    set({ companyLogsIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated
    try {
      let params = Object.fromEntries(
        Object.entries({
          page: companyLogsPage,
          performedBy: performedBy||undefined,
          action: action||undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      let res = await axios.get(`${config.API_BASE_URL}/logs`, {
        params,
        withCredentials: true,
      });
      
      set((state) => ({
        companyLogsData: [
          ...state.companyLogsData,
          ...res.data.map((a: any) => ({
            performedBy: a.performedBy,
            performedAt: format(new Date(a.createdAt), "dd/MM/yyyy"),
            actionType: a.action,
            extraData: a.extraData,
          })),
        ],
        companyLogsHasMore:  res.data.length > 0,
        companyLogsIsLoading: false,
        companyLogsPage: state.companyLogsPage + 1,
      }));

    }catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const success = await authRefreshToken();
          if (!success) return;
          return await get().companyLogsFetchData();
        }
      }
      console.error("Error fetching company logs:", err);
      set({ companyLogsIsLoading: false });
    }
    finally {
      set({ companyLogsIsLoading: false });
    }
  },

  companyLogsSetFilters: async (filters) => {
    set((state) => ({
      companyLogsFilters: {
        ...state.companyLogsFilters,
        ...filters,
      },
      companyLogsData: [],
      companyLogsPage: 1,
      companyLogsHasMore: true,
    }));
    await get().companyLogsFetchData();
  },
  companyLogsSetActionType: async () => {
    try {
      let res = await axios.get(`${config.API_BASE_URL}/logs/actions`, {
        withCredentials: true
      });
      if(res.status !== 200) return;
      set({
        companyLogsActionType: [
          ...res.data.map((logs: {id:number; action:string}) => ({
            value: logs.id,
            label: logs.action,
          })),
        ],
      });
    } catch(err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const success = await authRefreshToken();
          if (success) 
            return await get().companyLogsSetActionType();
        }
      }
    }
    // set({companyLogsActionType: [{value: "", label: "Any"}, ...mockCompanyActions.map((action) => ({value: String(action.id), label: action.name}))]});
  },

  companyLogsSetPerformedBy: async () => {
    try{
      let res = await axios.get(`${config.API_BASE_URL}/recruiters/allRecruiters`, {
        withCredentials: true
      });
      
      if(res.status !== 200) return;
      set({
        companyLogsPerformedBy: [
          ...res.data.map((recruiter:{id:number;name:string}) => ({
            value: recruiter.id,
            label: recruiter.name,
          })),
        ],
      });
    } catch(err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const success = await authRefreshToken();
          if (success)
            return await get().companyLogsSetPerformedBy();
        }
      }
      console.error("Error fetching performed by data:", err);
      showErrorToast("Failed to fetch performed by data. Please try again later.");
    }
    // set({companyLogsPerformedBy: [{value: "", label: "Any"}, ...mockCompanyPerformedBy.map((performedby) => ({value:performedby, label:performedby}))]});
  },

  companyLogsTabClear: () => {
    set({
      companyLogsData: [],
      companyLogsPage: 1,
      companyLogsHasMore: true,
      companyLogsIsLoading: false,
      companyLogsFilters: {
        performedBy: "",
        date: "",
        action: "",
      },
    });
  },
});
