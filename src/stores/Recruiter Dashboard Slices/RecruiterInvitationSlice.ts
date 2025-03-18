import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { Invitations, DashboardFilters } from "../../types/recruiterDashboard";
import { mockInvitations } from "../../mock data/recruiterInvitaions";


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
    recruiterInvitationsMakeDecision: (companyId: number, decision: number) => Promise<void>;
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

        set({ recruiterInvitationsIsLoading: true });

        try {
            // Simulate API call with a delay
            await new Promise<void>((resolve) =>
                setTimeout(() => {
                    const startIndex = (recruiterInvitationsPage - 1) * 5;
                    const endIndex = startIndex + 5;

                    // Apply filters (if any)
                    const filteredData = mockInvitations.filter((invitation) => {
                        if (recruiterInvitationsFilters.status && invitation.status !== recruiterInvitationsFilters.status) {
                            return false;
                        }
                        return true;
                    });

                    // Slice the data for pagination
                    const newRows = filteredData.slice(startIndex, endIndex);

                    // Update state with new data
                    set((state) => ({
                        recruiterInvitationsData: [
                            ...state.recruiterInvitationsData,
                            ...newRows.map((invitation) => ({
                                ...invitation,
                                dateReceived:
                                    formatDistanceToNow(
                                        new Date(invitation.
                                            dateReceived),
                                        { addSuffix: true }
                                    ),
                            })),
                        ],
                        recruiterInvitationsHasMore:
                            endIndex < filteredData.length,
                        recruiterInvitationsIsLoading: false,
                        recruiterInvitationsPage: state.recruiterInvitationsPage + 1,
                    }));

                    resolve();
                }, 500) // Simulate network delay
            );
        } catch (err) {
            set({ recruiterInvitationsIsLoading: false });
        }
    },

    // Set filters function
    recruiterInvitationsSetFilters: (filters) => {
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
    recruiterInvitationsMakeDecision: async (companyId, decision) => {
        // Simulate API call to update decision
        await new Promise<void>((resolve) =>
            setTimeout(() => {
                mockInvitations[companyId].status = JobOfferDecision[decision];
                set((state) => ({
                    recruiterInvitationsData: state.recruiterInvitationsData.map((invitation) => {
                        if (companyId === invitation.companyId) {
                            return {
                                ...invitation,
                                status: JobOfferDecision[decision]
                            };
                        }
                        return invitation;
                    }),
                }));
                resolve();
            }, 500) // Simulate network delay
        );
    },
});