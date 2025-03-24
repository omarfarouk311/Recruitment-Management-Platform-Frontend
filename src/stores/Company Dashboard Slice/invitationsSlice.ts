import { StateCreator } from "zustand";
import { Invitations, InvitationsFilters } from "../../types/companyDashboard";
import { CombinedState } from "../storeTypes";
import { format } from "date-fns";
import { mockCompanyInvitations } from "../../mock data/companyInvitations";

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
    } = get();
    if (!companyInvitationsHasMore || companyInvitationsIsLoading) return;
    set({ companyInvitationsIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        const startIndex = (companyInvitationsPage - 1) * 8;
        const endIndex = startIndex + 8;
        const newInvitations = mockCompanyInvitations.slice(
          startIndex,
          endIndex
        );
        set((state) => ({
          companyInvitationsData: [
            ...state.companyInvitationsData,
            ...newInvitations.map((invitation) => ({
              ...invitation,
              dateSent: format(new Date(invitation.dateSent), "MM/dd/yyyy"),
              deadline: format(new Date(invitation.deadline), "MM/dd/yyyy"),
            })),
          ],
          companyInvitationsPage: state.companyInvitationsPage + 1,
          companyInvitationsHasMore: endIndex < mockCompanyInvitations.length,
          companyInvitationsIsLoading: false,
        }));
        resolve();
      }, 500)
    );
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
