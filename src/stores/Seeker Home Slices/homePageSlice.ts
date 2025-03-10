import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export interface HomePageSlice {
    homePageActiveTab: number | null;
    homePageLoadingTab: number | null;
    setHomePageActiveTab: (tab: number) => void;
}

export const createHomePageSlice: StateCreator<CombinedState, [], [], HomePageSlice> = (set, get) => ({
    homePageActiveTab: null,
    homePageLoadingTab: null,

    setHomePageActiveTab: async (tab) => {
        const {
            homePageActiveTab,
            homePageLoadingTab,
            forYouTabFetchJobs,
            forYouTabJobs
        } = get();

        if (tab === homePageActiveTab || homePageLoadingTab) return;

        set({ homePageActiveTab: tab, homePageLoadingTab: tab });
        if (tab === 0) {
            // toggle for you tab after being in searching state or fetch jobs in the initial render
            if (homePageActiveTab === null || !forYouTabJobs.length) {
                await forYouTabFetchJobs();
            }
        } 
        set({ homePageLoadingTab: null });
    }
});