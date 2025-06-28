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
    companyLogsPerformedBy: { value: string, label: string }[];
    companyLogsActionType: { value: string, label: string }[];
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
        const { companyLogsPage, companyLogsHasMore, companyLogsFilters: { performedBy, action } } = get();
        if (!companyLogsHasMore) return;

        set({ companyLogsIsLoading: true });
        try {
            let params = Object.fromEntries(
                Object.entries({
                    page: companyLogsPage,
                    performedBy: performedBy || undefined,
                    action: action || undefined,
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
                        performedAt: new Date(a.createdAt),
                        actionType: a.action,
                        extraData: a.extraData || {},
                    })),
                ],
                companyLogsHasMore: res.data.length === config.paginationLimit,
                companyLogsPage: state.companyLogsPage + 1,
            }));

        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (!success) return;
                    return await get().companyLogsFetchData();
                }
                else showErrorToast("Failed to fetch logs. Please try again later.");
            }
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

            set({
                companyLogsActionType: [
                    ...res.data.map((logs: { id: number; action: string }) => ({
                        value: logs.id,
                        label: logs.action,
                    })),
                ],
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) return await get().companyLogsSetActionType();
                }
                else showErrorToast("Failed to fetch action type data. Please try again later.");
            }
        }
    },

    companyLogsSetPerformedBy: async () => {
        try {
            let res = await axios.get(`${config.API_BASE_URL}/recruiters/allRecruiters`, {
                withCredentials: true
            });

            set({
                companyLogsPerformedBy: [
                    ...res.data.map((performer: { id: number; name: string }) => ({
                        value: performer.id,
                        label: performer.name,
                    })),
                ],
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) return await get().companyLogsSetPerformedBy();
                }
                else showErrorToast("Failed to fetch performed by data. Please try again later.");
            }
        }
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
