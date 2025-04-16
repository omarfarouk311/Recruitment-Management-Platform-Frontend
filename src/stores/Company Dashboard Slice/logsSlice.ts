import { StateCreator } from "zustand";
import { Logs, LogsFilters } from "../../types/companyDashboard";
import { CombinedState } from "../storeTypes";
import { format } from "date-fns";
import { mockCompanyActions, mockCompanyLogs, mockCompanyPerformedBy } from "../../mock data/companyLogs";

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
    const { companyLogsPage, companyLogsHasMore, companyLogsIsLoading } = get();
    if (!companyLogsHasMore || companyLogsIsLoading) return;
    set({ companyLogsIsLoading: true });

    // mock API call, don't forget to include the filters in the query string if they are populated
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        const startIndex = (companyLogsPage - 1) * 8;
        const endIndex = startIndex + 8;
        const newLogs = mockCompanyLogs.slice(startIndex, endIndex);
        set((state) => ({
          companyLogsData: [
            ...state.companyLogsData,
            ...newLogs.map((log) => ({
              ...log,
              performedAt: format(
                new Date(log.performedAt),
                "MM/dd/yyyy h:mm a"
              ),
            })),
          ],
          companyLogsPage: state.companyLogsPage + 1,
          companyLogsHasMore: endIndex < mockCompanyLogs.length,
          companyLogsIsLoading: false,
        }));
        resolve();
      }, 500)
    );
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
    set({companyLogsActionType: [{value: "", label: "Any"}, ...mockCompanyActions.map((action) => ({value: String(action.id), label: action.name}))]});
  },

  companyLogsSetPerformedBy: async () => {
    set({companyLogsPerformedBy: [{value: "", label: "Any"}, ...mockCompanyPerformedBy.map((performedby) => ({value:performedby, label:performedby}))]});
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
