import { StateCreator } from 'zustand';
import { CompanyCard, CompaniesTabFilters } from '../../types/company';
import { mockCompanies, mockCompanyIndustries, mockCompanyLocations } from "../../mock data/seekerCompanies";
import { mockIndustries } from '../../mock data/seekerForYou';
import { CombinedState } from '../storeTypes';
import config from '../../../config/config';

const { paginationLimit } = config

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
    companiesTabFetchCompanyIndustries: (id: number) => Promise<void>;
    companiesTabFetchCompanyLocations: (id: number) => Promise<void>;
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
        const { companiesTabHasMore, companiesTabIsCompaniesLoading } = get();
        if (!companiesTabHasMore || companiesTabIsCompaniesLoading) return;
        set({ companiesTabIsCompaniesLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => {
                    const startIndex = (state.companiesTabPage - 1) * paginationLimit;
                    const endIndex = startIndex + paginationLimit;
                    const newCompanies = mockCompanies.slice(startIndex, endIndex);

                    return {
                        companiesTabCompanies: [...state.companiesTabCompanies, ...newCompanies],
                        companiesTabHasMore: endIndex < mockCompanies.length,
                        companiesTabIsCompaniesLoading: false,
                        companiesTabPage: state.companiesTabPage + 1
                    }
                });
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
                set({
                    companiesTabIndustryOptions: [
                        ...mockIndustries.map(({ value, label }) => ({ value: value.toString(), label }))
                    ]
                });

                resolve();
            }, 500));
        }
        catch (err) {
            set({ companiesTabIndustryOptions: [] });
        }
    },

    companiesTabFetchCompanyIndustries: async (id) => {
        if (get().companiesTabCompanies.find((company) => company.id === id)?.industries.length) return;

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                        if (company.id === id) {
                            return {
                                ...company,
                                industries: [...mockCompanyIndustries],
                                locations: [...company.locations]
                            }
                        }

                        return {
                            ...company,
                            industries: [...company.industries],
                            locations: [...company.locations]
                        }
                    })
                }));

                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    },

    companiesTabFetchCompanyLocations: async (id) => {
        if (get().companiesTabCompanies.find((company) => company.id === id)?.locations.length) return;

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                set((state) => ({
                    companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                        if (company.id === id) {
                            return {
                                ...company,
                                industries: [...company.industries],
                                locations: [...mockCompanyLocations]
                            }
                        }

                        return {
                            ...company,
                            industries: [...company.industries],
                            locations: [...company.locations]
                        }
                    })
                }));

                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    }
});