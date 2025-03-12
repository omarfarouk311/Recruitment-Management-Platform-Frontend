import { StateCreator } from 'zustand';
import { CompanyCard, CompaniesTabFilters } from '../../types/company';
import { mockCompanies } from "../../mock data/seekerCompanies";
import { CombinedState } from '../storeTypes';
import { mockIndustries } from '../../mock data/seekerForYou';

export interface CompaniesTabSlice {
    companiesTabCompanies: CompanyCard[];
    companiesTabPage: number;
    companiesTabHasMore: boolean;
    companiesTabIsCompaniesLoading: boolean;
    companiesTabFilters: CompaniesTabFilters;
    companiesTabSearchQuery: string;
    companiesTabIndustryOptions: { value: string, label: string }[];
    companiesTabFetchCompanies: () => Promise<void>;
    companiesTabSetFilters: (filters: Partial<CompaniesTabSlice['companiesTabFilters']>) => Promise<void>;
    companiesTabSetSearchQuery: (query: string) => void;
    companiesTabApplySearch: () => Promise<void>;
    companiesTabSetIndustryOptions: () => Promise<void>;
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
        size: '',
        rating: ''
    },
    companiesTabSearchQuery: '',
    companiesTabIndustryOptions: [],

    companiesTabFetchCompanies: async () => {
        const { companiesTabPage, companiesTabHasMore, companiesTabIsCompaniesLoading } = get();
        if (!companiesTabHasMore || companiesTabIsCompaniesLoading) return;
        set({ companiesTabIsCompaniesLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated
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

    companiesTabSetIndustryOptions: async () => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                const newIndustries = mockIndustries;

                set({
                    companiesTabIndustryOptions: [
                        { value: "", label: "Any" },
                        ...newIndustries.map(({ value, label }) => ({ value: value.toString(), label }))
                    ]
                });

                resolve();
            }, 500));
        }
        catch (err) {
            set({ companiesTabIndustryOptions: [] });
        }
    }
});