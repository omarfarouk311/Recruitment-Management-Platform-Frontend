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
            homePageActiveTab,
            homePageLoadingTab,
            forYouTabFetchJobs,
            forYouTabJobs,
            companiesTabFetchCompanies,
            companiesTabCompanies
        } = get();

        if (tab === homePageActiveTab || homePageLoadingTab) return;

        set({ homePageActiveTab: tab, homePageLoadingTab: tab });
        // fetch recommended jobs on on switch after being in searching state or if no jobs were fetched before
        if (tab === HomePageTabs.ForYou && (homePageActiveTab === HomePageTabs.JobSearch || !forYouTabJobs.length)) {
            await forYouTabFetchJobs();
        }
        // fetch companies on switch if no companies were fetched before
        else if (tab === HomePageTabs.Companies && !companiesTabCompanies.length) {
            await companiesTabFetchCompanies();
        }
        set({ homePageLoadingTab: null });
    }
});