import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyRecruiters, CompanyRecruitersFilter, RecruiterNames } from "../../types/companyDashboard";
const API_BASE_URL = config.API_BASE_URL;


export interface CompanyRecruitersSlice {
    CompanyRecruiters: CompanyRecruiters[];
    RecruiterNames: RecruiterNames[];
    CompanyRecruitersPage: number;
    CompanyRecruitersHasMore: boolean;
    CompanyRecruitersIsLoading: boolean;
    CompanyRecruitersFilters: CompanyRecruitersFilter;
    CompanyRecruiterId: number | null;
    

    CompanyRecruitersSetFilters: (
        filters: Partial<CompanyRecruitersFilter>
    ) => Promise<void>;
    CompanyRecruitersFetchRecruiters: () => Promise<void>;
    ResetCompanyRecruiters: () => void;
    CompanyRecruitersDelete: ( recruiterId: number ) => Promise<void>;
    CompanyRecruiterFetchAllRecruiters: () => Promise<void>;
    CompanyRecruiterSetId: (recruiterId: number | null) => void;
}

export const createCompanyRecruitersSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyRecruitersSlice
> = (set, get) => ({
    CompanyRecruiters: [],
    CompanyRecruitersPage: 1,
    CompanyRecruitersHasMore: true,
    CompanyRecruitersIsLoading: false,
    CompanyRecruitersFilters: {
        id: undefined,
        name: undefined,
        department: undefined,
        assigned_candidates_cnt: undefined,
    },
    RecruiterNames: [],
    CompanyRecruiterId: null,

    CompanyRecruiterSetId: (recruiterId) => {
        set({ CompanyRecruiterId: recruiterId });
    },
    
    CompanyRecruitersSetFilters: async (newFilters) => {
        console.log("newFilters", newFilters);
        set((state: CombinedState) => ({
            CompanyRecruitersFilters: {
                ...state.CompanyRecruitersFilters,
                ...newFilters,
            },
            CompanyRecruiters: [],
            CompanyRecruitersPage: 1,
            CompanyRecruitersHasMore: true,
        }));
        await get().CompanyRecruitersFetchRecruiters();
    },

    CompanyRecruitersFetchRecruiters: async () => {
        const { CompanyRecruitersPage, CompanyRecruitersFilters } = get();
        set({ CompanyRecruitersIsLoading: true });
        try {
            const cleanedFilters = Object.fromEntries(
                Object.entries(CompanyRecruitersFilters).filter(
                    ([_, value]) => value !== "" && value !== undefined && value !== null
                )
            );
            const response = await axios.get(
                `${API_BASE_URL}/recruiters`,
                {
                    params: {
                        page: CompanyRecruitersPage,
                        ...cleanedFilters,
                    },
                }
            );
            console.log("response", response);
        
            const data = response.data.recruiters;
            set((state) => ({
                CompanyRecruiters: [
                    ...state.CompanyRecruiters,
                    ...data,
                ],
                CompanyRecruitersHasMore: data.length > 0,
                CompanyRecruitersPage: state.CompanyRecruitersPage + 1,
            }));
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },

    ResetCompanyRecruiters: () => {
        set({
            CompanyRecruiters: [],
            CompanyRecruitersPage: 1,
            CompanyRecruitersHasMore: true,
            CompanyRecruitersIsLoading: false,
            CompanyRecruitersFilters: {
                id: undefined,
                name: undefined,
                department: undefined,
                assigned_candidates_cnt: undefined,
            },
            RecruiterNames: [],
            CompanyRecruiterId: null,
        });
    },

    CompanyRecruitersDelete: async (recruiterId) => {
        set({ CompanyRecruitersIsLoading: true });
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/recruiters/${recruiterId}`
            );
            if (response.status === 200) {
                set((state) => ({
                    CompanyRecruiters: state.CompanyRecruiters.filter(
                        (recruiter) => recruiter.id !== recruiterId
                    ),
                }));
            }
        } catch (error) {
            console.error("Error deleting recruiter:", error);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },
    CompanyRecruiterFetchAllRecruiters: async () => {
        set({ CompanyRecruitersIsLoading: true });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/recruiters`
            );
            const data = response.data;
            set({
                RecruiterNames: data.recruiters,
            });
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },
});
