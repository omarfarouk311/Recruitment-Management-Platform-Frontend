import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Invitations, DashboardFilters, DashboardStatusFilterOptions } from "../../types/recruiterDashboard";
import axios from 'axios';
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
    recruiterInvitationsClear: () => void;
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

    recruiterInvitationsClear: () => {
        set({
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
        });
    },

    recruiterInvitationsFetchData: async () => {
        const {
            recruiterInvitationsPage,
            recruiterInvitationsHasMore,
            recruiterInvitationsFilters,
        } = get();

        if (!recruiterInvitationsHasMore) return;

        set({ recruiterInvitationsIsLoading: true });
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
                withCredentials: true
            });

            const newRows = response.data;
            set((state) => ({
                recruiterInvitationsData: [
                    ...state.recruiterInvitationsData,
                    ...newRows.map((invitation: Invitations) => ({
                        ...invitation,
                        dateReceived: new Date(invitation.dateReceived),
                    })),
                ],
                recruiterInvitationsHasMore: newRows.length === config.paginationLimit,
                recruiterInvitationsPage: state.recruiterInvitationsPage + 1
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().recruiterInvitationsFetchData();
                    }
                }
                else showErrorToast("Failed to fetch invitations. Please try again later.");
            }
        }
        finally {
            set({ recruiterInvitationsIsLoading: false });
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
        set({ recruiterInvitationsIsLoading: true });

        try {
            await axios.patch(`${API_BASE_URL}/invitations/${invitationId}`, {
                status: decision,
                date: new Date().toISOString()
            }, {
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
            }));

        } catch (err) {
                let errorMessage = "An error occurred while making a decision on the invitation.";
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
                    recruiterInvitationsIsLoading: false
                });

                showErrorToast(errorMessage);
                throw new Error(errorMessage);
            }
    },
});