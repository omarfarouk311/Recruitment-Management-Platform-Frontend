import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

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