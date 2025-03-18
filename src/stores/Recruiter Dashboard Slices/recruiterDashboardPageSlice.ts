import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';


export enum recruiterDashboardTabs {
    candidates = 0,
    interviews = 1,
    jobOfferSent = 2,
    invitations = 3,
}

export interface recruiterDashboardPageSlice {
    recruiterDashboardActiveTab: number | null;
    recruiterDashboardLoadingTab: number | null;
    setRecruiterDashboardActiveTab: (tab: number) => void;
}

export const createRecruiterDashboardPageSlice: StateCreator<CombinedState, [], [], recruiterDashboardPageSlice> = (set, get) => ({
    recruiterDashboardActiveTab: null,
    recruiterDashboardLoadingTab: null,

    setRecruiterDashboardActiveTab: async (tab) => {
        const { recruiterDashboardActiveTab, recruiterDashboardLoadingTab, recruiterInvitationsFetchData } = get();
        if (tab === recruiterDashboardActiveTab || recruiterDashboardLoadingTab) return;

        set({ recruiterDashboardActiveTab: tab, recruiterDashboardLoadingTab: tab });

        if (tab === 3) {
            await recruiterInvitationsFetchData();
            console.log("Fetching data for invitations tab");

        }

        setTimeout(() => {
            set({ recruiterDashboardLoadingTab: null });
        }, 1000)
    }
});