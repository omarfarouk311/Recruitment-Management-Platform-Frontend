import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { Invitations, DashboardFilters, DashboardStatusFilterOptions } from "../../types/recruiterDashboard";
import axios, { CancelTokenSource } from 'axios';
import config from '../../../config/config.ts';
import { showErrorToast } from '../../util/errorHandler';

const API_BASE_URL = config.API_BASE_URL;

import { authRefreshToken } from '../../util/authUtils.ts';


export enum JobOfferDecision {
    Rejected = 0,
    Accepted = 1
}

export interface RecruiterInvitationsSlice {
    recruiterInvitationsData: Invitations[];
    recruiterInvitationsPage: number;
    recruiterInvitationsHasMore: boolean;
    recruiterInvitationsIsLoading: boolean;
    recruiterInvitationsFilters: DashboardFilters;
    recruiterInvitationsCompanyNames: { value: string; label: string }[];
    recruiterInvitationsFetchData: () => Promise<void>;
    recruiterInvitationsSetFilters: (filters: Partial<RecruiterInvitationsSlice['recruiterInvitationsFilters']>) => void;
    recruiterInvitationsMakeDecision: (invitationId: number, decision: number) => Promise<void>;
    recruiterInvitationsCancelRequests: () => void;
    recruiterInvitationsCancelToken?: CancelTokenSource;
}

export const createInvitationsSlice: StateCreator<
    CombinedState,
    [],
    [],
    RecruiterInvitationsSlice
> = (set, get) => ({
    recruiterInvitationsData: [],
    recruiterInvitationsPage: 1,
    recruiterInvitationsHasMore: true,
    recruiterInvitationsIsLoading: false,
    recruiterInvitationsFilters: {
        status: "",
        sortByDateReceived: "",
        sortByDeadline: ""
    },
    recruiterInvitationsCompanyNames: [],

    recruiterInvitationsCancelRequests: () => {
        const { recruiterInvitationsCancelToken } = get();
        if (recruiterInvitationsCancelToken) {
            recruiterInvitationsCancelToken.cancel('Operation canceled by the user.');
            set({ recruiterInvitationsCancelToken: undefined });
        }
    },

    recruiterInvitationsFetchData: async () => {
        const {
            recruiterInvitationsPage,
            recruiterInvitationsHasMore,
            recruiterInvitationsIsLoading,
            recruiterInvitationsFilters,
        } = get();

        if (!recruiterInvitationsHasMore || recruiterInvitationsIsLoading) return;

        get().recruiterInvitationsCancelRequests();

        const cancelToken = axios.CancelToken.source();
        set({ recruiterInvitationsIsLoading: true, recruiterInvitationsCancelToken: cancelToken });

        try {
            const currentStatus = DashboardStatusFilterOptions.find(
                option => option.value === recruiterInvitationsFilters.status
            );

            const response = await axios.get(`${API_BASE_URL}/invitations/`, {
                params: Object.fromEntries(
                    Object.entries({
                        page: recruiterInvitationsPage,
                        status: currentStatus?.label.toLowerCase(),
                        sortByDate: recruiterInvitationsFilters.sortByDateReceived,
                        sortByDeadline: recruiterInvitationsFilters.sortByDeadline == "" ? "" : (recruiterInvitationsFilters.sortByDeadline == "2" ? "1" : "-1")
                    }).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                ),
                cancelToken: cancelToken.token,
                withCredentials: true
            });

            const newRows = response.data;
            set((state) => ({
                recruiterInvitationsData: [
                    ...state.recruiterInvitationsData,
                    ...newRows.map((invitation: Invitations) => ({
                        ...invitation,
                        dateReceived: formatDistanceToNow(new Date(invitation.dateReceived)),
                    })),
                ],
                recruiterInvitationsHasMore: newRows.length > 0,
                recruiterInvitationsIsLoading: false,
                recruiterInvitationsPage: state.recruiterInvitationsPage + 1,
                recruiterInvitationsCancelToken: undefined,
            }));

        } catch (err) {
            if (!axios.isCancel(err)) {
                set({ recruiterInvitationsIsLoading: false, recruiterInvitationsCancelToken: undefined });
                
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        const success = await authRefreshToken();
                        if (success) {
                            return get().recruiterInvitationsFetchData();
                        }
                    }
                }
                console.error('Failed to fetch invitations:', err);
            }
        }
    },

    recruiterInvitationsSetFilters: (filters) => {
        const currentFilters = get().recruiterInvitationsFilters;
        let tmp = 0;
        
        if (filters.sortByDateReceived && filters.sortByDeadline) {
            tmp = 1;
            if (currentFilters.sortByDateReceived) {
                filters.sortByDeadline = "";
            } else if (currentFilters.sortByDeadline) {
                filters.sortByDateReceived = "";
            } 
            showErrorToast("Please sort by either date received or deadline, not both");
        }
        
        if (!tmp) {
            set((state) => ({
                recruiterInvitationsFilters: { ...state.recruiterInvitationsFilters, ...filters },
                recruiterInvitationsData: [],
                recruiterInvitationsPage: 1,
                recruiterInvitationsHasMore: true,
            }));
            get().recruiterInvitationsFetchData();
        }
    },

    recruiterInvitationsMakeDecision: async (invitationId, decision) => {
        const cancelToken = axios.CancelToken.source();
        set({ recruiterInvitationsIsLoading: true, recruiterInvitationsCancelToken: cancelToken });

        try {
            await axios.patch(`${API_BASE_URL}/invitations/${invitationId}`, {
                status: decision,
                date: new Date().toISOString()
            }, {
                cancelToken: cancelToken.token,
                withCredentials: true
            });

            set((state) => ({
                recruiterInvitationsData: state.recruiterInvitationsData.map(invitation =>
                    invitation.id === invitationId
                        ? {
                            ...invitation,
                            status: decision === JobOfferDecision.Accepted ? "Accepted" : "Rejected",
                        }
                        : invitation
                ),
                recruiterInvitationsIsLoading: false,
                recruiterInvitationsCancelToken: undefined,
            }));

        } catch (err) {
            if (!axios.isCancel(err)) {
                let errorMessage = "Something went wrong. Please try again.";

                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        const success = await authRefreshToken();
                        if (success) {
                            return get().recruiterInvitationsMakeDecision(invitationId, decision);
                        }
                    }
                    if (err.response?.status === 409) {
                        errorMessage = "You're already hired in a company, so you cannot accept this invitation.";
                    }
                    else if (err.response?.status === 400) {
                        errorMessage = "The invitation has expired.";
                    }
                }

                set({
                    recruiterInvitationsIsLoading: false,
                    recruiterInvitationsCancelToken: undefined,
                });
                
                await showErrorToast(errorMessage);
                throw new Error(errorMessage);
            }
        }
    },
});