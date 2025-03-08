import { StateCreator } from 'zustand';
import { CompanyCard, CompaniesTabFilters } from '../../types/company';
import { mockCompanies } from "../../mock data/companies";
import { CombinedState } from '../storeTypes';

export interface CompaniesTabSlice {
    companiesTabCompanies: CompanyCard[];
    companiesTabPage: number;
    companiesTabHasMore: boolean;
    companiesTabIsCompaniesLoading: boolean;
    companiesTabFilters: CompaniesTabFilters;
    companiesTabSearchQuery: string;
    companiesTabFetchCompanies: () => Promise<void>;
    companiesTabSetFilters: (filters: Partial<CompaniesTabSlice['companiesTabFilters']>) => Promise<void>;
    companiesTabSetSearchQuery: (query: string) => void;
    companiesTabApplySearch: () => Promise<void>;
}

export const createCompaniesTabSlice: StateCreator<CombinedState, [], [], CompaniesTabSlice> = (set, get, _api) => ({
    companiesTabCompanies: [],
    companiesTabPage: 1,
    companiesTabHasMore: true,
    companiesTabIsCompaniesLoading: false,
    companiesTabFilters: {
        country: '',
        city: '',
        industry: '',
        type: '',
        sizeFrom: '',
        sizeTo: '',
        rating: ''
    },
    companiesTabSearchQuery: '',

    companiesTabFetchCompanies: async () => {
        const { companiesTabPage, companiesTabHasMore, companiesTabIsCompaniesLoading } = get();
        if (!companiesTabHasMore || companiesTabIsCompaniesLoading) return;
        set({ companiesTabIsCompaniesLoading: true });

        // 
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const startIndex = (companiesTabPage - 1) * 5;
                const endIndex = startIndex + 5;
                const newCompanies = mockCompanies.slice(startIndex, endIndex);

                set((state) => ({
                    companiesTabCompanies: [...state.companiesTabCompanies, ...newCompanies],
                    companiesTabHasMore: endIndex < mockCompanies.length,
                    companiesTabIsCompaniesLoading: false,
                    companiesTabPage: state.companiesTabPage + 1,
                }));
                resolve();
            }, 500));
        } catch (err) {
            set({ companiesTabIsCompaniesLoading: false });
        }
    },

    companiesTabSetFilters: async (filters) => {
        set((state) => ({
            companiesTabFilters: { ...state.companiesTabFilters, ...filters },
            companiesTabCompanies: [],
            companiesTabPage: 1,
            companiesTabIsCompaniesLoading: false,
            companiesTabHasMore: true,
        }));

        await get().companiesTabFetchCompanies();
    },

    companiesTabSetSearchQuery: (query: string) => {
        set({ companiesTabSearchQuery: query });
    },

    companiesTabApplySearch: async () => {
        const { companiesTabSearchQuery } = get();
        if (!companiesTabSearchQuery) return;

        set({
            companiesTabCompanies: [],
            companiesTabPage: 1,
            companiesTabIsCompaniesLoading: false,
            companiesTabHasMore: true,
        });

        await get().companiesTabFetchCompanies();
    },
});