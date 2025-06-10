import { StateCreator } from 'zustand';
import { CompanyCard, CompaniesTabFilters } from '../../types/company';
import { CombinedState } from '../storeTypes';
import config from '../../../config/config';
import axios from "axios";
import { showErrorToast } from '../../util/errorHandler';
import { authRefreshToken } from '../../util/authUtils';

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
    companiesTabFetchCompanyIndustries: (id: number) => Promise<void>;
    companiesTabFetchCompanyLocations: (id: number) => Promise<void>;
    companiesTabClear: () => void
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

    companiesTabFetchCompanies: async () => {
        const {
            companiesTabPage,
            companiesTabHasMore,
            companiesTabIsCompaniesLoading,
            companiesTabSearchQuery,
            companiesTabFilters: { country, city, industry, type, size, rating },
        } = get();

        if (!companiesTabHasMore || companiesTabIsCompaniesLoading) return;
        set({ companiesTabIsCompaniesLoading: true });

        try {
            let params = Object.fromEntries(
                Object.entries({
                    page: companiesTabPage,
                    companyCountry: country || undefined,
                    companyCity: city || undefined,
                    companyIndustry: industry || undefined,
                    companyType: type || undefined,
                    size: size || undefined,
                    companyRating: rating || undefined,
                    companyName: companiesTabSearchQuery || undefined,
                }).filter(([_, value]) => value !== undefined)
            );

            if (params.size) {
                params.companyMinSize = size.split('-')[0];
                params.companyMaxSize = size.split('-')[1];
                delete params.size;
            }

            let res = await axios.get(`${config.API_BASE_URL}/seekers/companies`, {
                params,
            });

            set((state) => ({
                companiesTabCompanies: [
                    ...state.companiesTabCompanies,
                    ...res.data.map((obj: any) => ({
                        id: obj.id,
                        image: `${config.API_BASE_URL}/companies/${obj.id}/image`,
                        name: obj.name,
                        overview: obj.overview,
                        size: obj.size,
                        rating: obj.rating,
                        reviewsCount: obj.reviewsCount,
                        jobsCount: obj.jobsCount,
                        locationsCount: obj.locationsCount,
                        industriesCount: obj.industriesCount,
                        locations: [],
                        industries: [],
                    })),
                ],
                companiesTabHasMore: res.data.length === config.paginationLimit,
                companiesTabPage: state.companiesTabPage + 1,
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().companiesTabFetchCompanies();
                    }
                }
                else if (err.response?.status === 400) {
                    const validationErrors: string[] = err.response?.data.validationErrors;
                    validationErrors.forEach((validationError) => {
                        showErrorToast(validationError);
                    });
                }
                else if (err.response?.status === 403) {
                    showErrorToast('Unauthorized access');
                }
                else {
                    showErrorToast('Failed to fetch companies');
                }
            }
        }
        finally {
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

    companiesTabFetchCompanyIndustries: async (id) => {
        if (get().companiesTabCompanies.find((company) => company.id === id)?.industries.length) return;

        try {
            const res = await axios.get(`${config.API_BASE_URL}/companies/${id}/industries`);
            const data: { id: number, name: string }[] = res.data;

            set((state) => ({
                companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                    if (company.id === id) {
                        return {
                            ...company,
                            industries: data.map((val) => val.name),
                            locations: [...company.locations]
                        }
                    }

                    return company;
                })
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().companiesTabFetchCompanyIndustries(id);
                    }
                }
                else {
                    showErrorToast('Failed to fetch company industries');
                }
            }
        }
    },

    companiesTabFetchCompanyLocations: async (id) => {
        if (get().companiesTabCompanies.find((company) => company.id === id)?.locations.length) return;

        try {
            const res = await axios.get(`${config.API_BASE_URL}/companies/${id}/locations`);
            const data: { country: string, city: string }[] = res.data;

            set((state) => ({
                companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                    if (company.id === id) {
                        return {
                            ...company,
                            industries: [...company.industries],
                            locations: [...data],
                        }
                    }

                    return company;
                })
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().companiesTabFetchCompanyLocations(id);
                    }
                }
                else {
                    showErrorToast('Failed to fetch company locations');
                }
            }
        }
    },

    companiesTabClear: () => {
        set({
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
            companiesTabSearchQuery: ''
        })
    }
});