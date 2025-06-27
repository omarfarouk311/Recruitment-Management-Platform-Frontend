import { StateCreator } from "zustand";
import { Invitations, InvitationsFilters } from "../../types/companyDashboard";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";
import { authRefreshToken } from "../../util/authUtils.ts";
import { showErrorToast } from "../../util/errorHandler.ts";

export interface CompanyInvitationsSlice {
  companyInvitationsData: Invitations[];
  companyInvitationsPage: number;
  companyInvitationsHasMore: boolean;
  companyInvitationsIsLoading: boolean;
  companyInvitationsFilters: InvitationsFilters;
  companyInvitationsFetchData: () => Promise<void>;
  companyInvitationsSetFilters: (
    sortBy: Partial<CompanyInvitationsSlice["companyInvitationsFilters"]>
  ) => Promise<void>;
  companyInvitationsTabClear: () => void;
}

export const createCompanyInvitationsSlice: StateCreator<
  CombinedState,
  [],
  [],
  CompanyInvitationsSlice
> = (set, get) => ({
  companyInvitationsData: [],
  companyInvitationsPage: 1,
  companyInvitationsHasMore: true,
  companyInvitationsIsLoading: false,
  companyInvitationsFilters: {
    status: "",
    sortBy: "",
  },

  companyInvitationsFetchData: async () => {
    const {
      companyInvitationsPage,
      companyInvitationsHasMore,
      companyInvitationsFilters: { status, sortBy },
    } = get();
    if (!companyInvitationsHasMore) return;
    set({ companyInvitationsIsLoading: true });
    
    try {
      let params = Object.fromEntries(
        Object.entries({
          page: companyInvitationsPage,
          status: status == "2" ? "rejected" : (status == "1" ? "accepted" : (status == "0" ? "pending" : undefined)),
          sortByDate: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
          sortByDeadline: Math.abs(parseInt(sortBy)) === 2 ? parseInt(sortBy) / 2 : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      let res = await axios.get(`${config.API_BASE_URL}/invitations`, {
        params,
        withCredentials: true,
      });
      
      set((state) => ({
        companyInvitationsData: [
          ...state.companyInvitationsData,
          ...res.data.map((a: any) => ({
            department: a.department,
            recruiter: a.recruiterName,
            dateSent: a.dateSent,
            recruiterId: a.recruiterId,
            deadline: a.deadline,
            status: a.status,
          })),
        ],
        companyInvitationsHasMore:  res.data.length > 0,
        companyInvitationsIsLoading: false,
        companyInvitationsPage: state.companyInvitationsPage + 1,
      }));

    }catch (err) {
      if(axios.isAxiosError(err) && err.response?.status === 401) {
        let success = await authRefreshToken();
        if(success) {
          return await get().companyInvitationsFetchData();
        } 
      }
      console.error("Error fetching company invitations:", err);
      showErrorToast("Failed to fetch company invitations. Please try again later.");
    }
    finally {
      set({ companyInvitationsIsLoading: false });
    }
  },


  companyInvitationsSetFilters: async (filters) => {
    set((state) => ({
      companyInvitationsFilters: {
        ...state.companyInvitationsFilters,
        ...filters,
      },
      companyInvitationsData: [],
      companyInvitationsPage: 1,
      companyInvitationsHasMore: true,
    }));
    await get().companyInvitationsFetchData();
  },
  companyInvitationsTabClear: () => {
    set({
      companyInvitationsData: [],
      companyInvitationsPage: 1,
      companyInvitationsHasMore: true,
      companyInvitationsIsLoading: false,
      companyInvitationsFilters: {
        status: "",
        sortBy: "",
      },
    });
  },
});
