import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export interface HomePageSlice {
    homePageActiveTab: number | null;
    homePageLoadingTab: number | null;
    setHomePageActiveTab: (tab: number) => void;
}

export enum HomePageTabs {
    ForYou = 0,
    Companies = 1,
    JobSearch = 2,
}

export const createHomePageSlice: StateCreator<CombinedState, [], [], HomePageSlice> = (set, get) => ({
    homePageActiveTab: null,
    homePageLoadingTab: null,

    setHomePageActiveTab: async (tab) => {
        const {
            forYouTabFetchJobs,
            companiesTabFetchCompanies,
            forYouTabClear,
            companiesTabClear,
            homePageActiveTab
        } = get();

        set({ homePageActiveTab: tab, homePageLoadingTab: tab });
        if (tab === HomePageTabs.ForYou) {
            if (homePageActiveTab === HomePageTabs.Companies) companiesTabClear();
            else forYouTabClear();
            await forYouTabFetchJobs();
        }
        else if (tab === HomePageTabs.Companies) {
            if (homePageActiveTab === HomePageTabs.Companies) companiesTabClear();
            else forYouTabClear();
            await companiesTabFetchCompanies();
        }
        set({ homePageLoadingTab: null });
    }
});