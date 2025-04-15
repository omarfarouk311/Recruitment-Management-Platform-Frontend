import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { Invitations, DashboardFilters, DashboardStatusFilterOptions } from "../../types/recruiterDashboard";
import axios, { CancelTokenSource } from 'axios';
import config from '../../../config/config.ts';
import { showErrorToast } from '../../util/errorHandler';

const API_BASE_URL = config.API_BASE_URL;

export enum JobOfferDecision {
    Rejected = 0,
    Accepted = 1
}
// Interface for Invitations Slice
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

// Create Invitations Slice
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

    // Fetch data function
    recruiterInvitationsFetchData: async () => {
        const {
            recruiterInvitationsPage,
            recruiterInvitationsHasMore,
            recruiterInvitationsIsLoading,
            recruiterInvitationsFilters,
        } = get();

        // Return early if no more data or already loading
        if (!recruiterInvitationsHasMore || recruiterInvitationsIsLoading) return;

        // Cancel previous request if it exists
        get().recruiterInvitationsCancelRequests();

        // Create new cancel token
        const cancelToken = axios.CancelToken.source();
        set({ recruiterInvitationsIsLoading: true, recruiterInvitationsCancelToken: cancelToken });
        console.log("fetching recruiter data")
        console.log(recruiterInvitationsFilters.sortByDateReceived)
        const currentStatus = DashboardStatusFilterOptions.find(
            option => option.value === recruiterInvitationsFilters.status
        );

        try {
            // Make API call with filters and pagination
            const response = await axios.get(`${API_BASE_URL}/invitations/`, {
                params: Object.fromEntries(
                    Object.entries({
                        page: recruiterInvitationsPage,
                        status: currentStatus?.label.toLowerCase(),
                        sortByDate: recruiterInvitationsFilters.sortByDateReceived,
                        sortByDeadline: recruiterInvitationsFilters.sortByDeadline == "" ? "" : (recruiterInvitationsFilters.sortByDeadline == "2" ? "1" : "-1")
                    }).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                ),
                cancelToken: cancelToken.token
            });
            console.log(response.data)
            const newRows = response.data;
            const hasMore = response.data.length > 0;
            set((state) => ({
                recruiterInvitationsData: [
                    ...state.recruiterInvitationsData, // Existing data after
                    ...newRows.map((invitation: Invitations) => ({   // New data first
                        ...invitation,
                        dateReceived: formatDistanceToNow(new Date(invitation.dateReceived)),
                    })),

                ],
                recruiterInvitationsHasMore: hasMore,
                recruiterInvitationsIsLoading: false,
                recruiterInvitationsPage: state.recruiterInvitationsPage + 1,
                recruiterInvitationsCancelToken: undefined,
            }));

        } catch (err) {
            if (!axios.isCancel(err)) {
                set({ recruiterInvitationsIsLoading: false, recruiterInvitationsCancelToken: undefined });
                console.error('Failed to fetch invitations:', err);
                // Handle error appropriately (e.g., show notification)
            }
        }
    },

    // Set filters function
    recruiterInvitationsSetFilters: (filters) => {
        console.log(filters)
        set((state) => ({
            recruiterInvitationsFilters: { ...state.recruiterInvitationsFilters, ...filters },
            recruiterInvitationsData: [], // Reset data when filters change
            recruiterInvitationsPage: 1, // Reset pagination
            recruiterInvitationsHasMore: true, // Reset hasMore flag
        }));

        // Fetch new data after updating filters
        get().recruiterInvitationsFetchData();
    },

    // Make decision function
    recruiterInvitationsMakeDecision: async (invitationId, decision) => {
        const cancelToken = axios.CancelToken.source();
        set({ recruiterInvitationsIsLoading: true, recruiterInvitationsCancelToken: cancelToken });

        try {
            await axios.patch(`${API_BASE_URL}/invitations/${invitationId}`, {
                status: decision,
                date: new Date().toISOString()
            }, {
                cancelToken: cancelToken.token
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

                if (axios.isAxiosError(err) && err.response?.status === 409) {
                    errorMessage = "You're already hired in a company, so you cannot accept this invitation.";
                }
                else if (axios.isAxiosError(err) && err.response?.status === 400) {
                    errorMessage = "The invitation has expired.";
                }


                set({
                    recruiterInvitationsIsLoading: false,
                    recruiterInvitationsCancelToken: undefined,
                });
                const error =  new Error(errorMessage); // Throw error to be caught by component
                showErrorToast(
                    error.message
                );
            }
        }
    },
});