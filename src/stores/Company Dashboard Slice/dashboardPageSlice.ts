import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export enum companyDashboardTabs {
    jobs = 0,
    recruiters = 1,
    logs = 2,
    templates = 3,
    recruiterProcess = 4,
    assessments = 5,
    invitations = 6,
}

export interface CompanyDashboardPageSlice {
    companyDashboardActiveTab: number | null;
    companyDashboardLoadingTab: number | null;
    setCompanyDashboardActiveTab: (tab: number) => void;
}

export const createCompanyDashboardPageSlice: StateCreator<CombinedState, [], [], CompanyDashboardPageSlice> = (set, get) => ({
    companyDashboardActiveTab:null,
    companyDashboardLoadingTab:null,

    setCompanyDashboardActiveTab: async (tab) => {
        const { companyDashboardActiveTab, companyDashboardLoadingTab, companyInvitationsFetchData } = get();
        if (tab === companyDashboardActiveTab || companyDashboardLoadingTab) return;

        set({ companyDashboardActiveTab: tab, companyDashboardLoadingTab: tab });

        if(tab === companyDashboardTabs.invitations)
            await companyInvitationsFetchData();

        setTimeout(() => {
            set({ companyDashboardLoadingTab: null });
        }, 1000)
    }
})