import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export enum seekerDashboardTabs {
    jobsAppliedFor = 0,
    assessments = 1,
    interviews = 2,
    offers = 3,
}

export interface DashboardPageSlice {
    seekerDashboardActiveTab: number | null;
    seekerDashboardLoadingTab: number | null;
    setSeekerDashboardActiveTab: (tab: number) => void;
}

export const createSeekerDashboardPageSlice: StateCreator<CombinedState, [], [], DashboardPageSlice> = (set, get) => ({
    seekerDashboardActiveTab: null,
    seekerDashboardLoadingTab: null,

    setSeekerDashboardActiveTab: async (tab) => {
        const { seekerDashboardActiveTab, seekerDashboardLoadingTab, seekerJobsAppliedForFetchData } = get();
        if (tab === seekerDashboardActiveTab || seekerDashboardLoadingTab) return;

        set({ seekerDashboardActiveTab: tab, seekerDashboardLoadingTab: tab });

        if(tab === 0)
            await seekerJobsAppliedForFetchData();

        setTimeout(() => {
            set({ seekerDashboardLoadingTab: null });
        }, 1000)
    }
});