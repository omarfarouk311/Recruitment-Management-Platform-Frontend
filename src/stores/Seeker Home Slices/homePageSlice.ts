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
        const { homePageActiveTab, homePageLoadingTab: homePageIsTabLoading, forYouTabFetchJobs } = get();
        if (tab === homePageActiveTab || homePageIsTabLoading) return;

        set({ homePageActiveTab: tab, homePageLoadingTab: tab });

        // toggle for you tab after being in searching state
        if (tab === 0 && homePageActiveTab === null) {
            await forYouTabFetchJobs();
        }

        setTimeout(() => {
            set({ homePageLoadingTab: null });
        }, 1000)
    }
});