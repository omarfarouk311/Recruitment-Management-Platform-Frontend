import { StateCreator } from "zustand";
import { Invitations, InvitationsFilters } from "../../types/companyDashboard";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config.ts";

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
      companyInvitationsIsLoading,
      companyInvitationsFilters: { status, sortBy },
    } = get();
    if (!companyInvitationsHasMore || companyInvitationsIsLoading) return;
    set({ companyInvitationsIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated


    try {
      let params = Object.fromEntries(
        Object.entries({
          page: companyInvitationsPage,
          status: status == "3" ? "rejected" : (status == "2" ? "accepted" : undefined),
          sortBy: Math.abs(parseInt(sortBy)) === 1 ? parseInt(sortBy) : undefined,
        }).filter(([_, value]) => value !== undefined)
      );

      let res = await axios.get(`${config.API_BASE_URL}/invitations`, {
        params,
      });
      
      set((state) => ({
        companyInvitationsData: [
          ...state.companyInvitationsData,
          ...res.data.map((a: any) => ({
            department: a.department,
            recruiter: a.recruiterName,
            dateSent: a.dateSent,
            recruiterId: a.recruiterId,
            deadline: formatDistanceToNow(new Date(a.deadline), { addSuffix: true }),
            status: a.status,
          })),
        ],
        companyInvitationsHasMore:  res.data.length > 0,
        companyInvitationsIsLoading: false,
        companyInvitationsPage: state.companyInvitationsPage + 1,
      }));

    }catch (err) {
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
