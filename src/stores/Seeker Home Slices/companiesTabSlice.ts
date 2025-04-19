import { StateCreator } from 'zustand';
import { CompanyCard, CompaniesTabFilters } from '../../types/company';
import { mockCompanies, mockCompanyIndustries, mockCompanyLocations } from "../../mock data/seekerCompanies";
import { CombinedState } from '../storeTypes';
import config from '../../../config/config';
import axios from "axios";

const { paginationLimit } = config

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
        const { companiesTabPage, 
                companiesTabHasMore, 
                companiesTabIsCompaniesLoading,
                companiesTabFilters:{country, city, industry, type, size, rating},
             } = get();
        if (!companiesTabHasMore || companiesTabIsCompaniesLoading) return;
        set({ companiesTabIsCompaniesLoading: true });

        // mock API call, don't forget to include the filters in the query string if they are populated

        try {
            let params = Object.fromEntries(
              Object.entries({
                page:companiesTabPage,
                country: country || undefined,
                city: city || undefined,
                industry: industry || undefined,
                type: type || undefined,
                size: size || undefined,
                rating: rating || undefined,
              }).filter(([_, value]) => value !== undefined)
            );
            
            let res = await axios.get(`${config.API_BASE_URL}/seekers/companies`, {
              params,
            });
           
            
            set((state) => ({
                companiesTabCompanies: [
                ...state.companiesTabCompanies,
                ...res.data.map((obj: any) => ({
                    id: obj.id,
                    image: `${config.API_BASE_URL}/companies/${obj.id}/image`|| 'https://via.placeholder.com/150',
                    name: obj.name,
                    overview: obj.overview || 'No overview available',
                    size: obj.size ,
                    rating: obj.rating,
                    reviewsCount: obj.reviewsCount ,
                    jobsCount: obj.jobsCount ,
                    locationsCount: obj.locationsCount,
                    industriesCount: obj.industriesCount ,
                    locations: [...obj.locations||[]],
                    industries: [...obj.industries||[]],
                })),
              ],
              companiesTabHasMore:  res.data.length > 0,
              companiesTabIsCompaniesLoading: false,
              companiesTabPage: state.companiesTabPage + 1,
            }));
      
          }catch (err) {
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

        // mock API call
        try {
            const res = await axios.get(`${config.API_BASE_URL}/companies/${id}/industries`);
            const data:{id:number, name:string}[] = res.data;
           
                set((state) => ({
                    companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                        if (company.id === id) {
                            return {
                                ...company,
                                industries: data.map((val)=> val.name),
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


           
        }
        catch (err) {
            console.error(err);
        }
    },

    companiesTabFetchCompanyLocations: async (id) => {
        if (get().companiesTabCompanies.find((company) => company.id === id)?.locations.length) return;

        // mock API call
        try {
            const res = await axios.get(`${config.API_BASE_URL}/companies/${id}/locations`);
            const data:{country:string, city:string}[] = res.data;
           
                set((state) => ({
                    companiesTabCompanies: state.companiesTabCompanies.map((company) => {
                        if (company.id === id) {
                            return {
                                ...company,
                                industries: [...company.industries],
                                locations: [...data],
                            }
                        }

                        return {
                            ...company,
                            industries: [...company.industries],
                            locations: [...company.locations]
                        }
                    })
                }));


           
        }
        catch (err) {
            console.error(err);
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