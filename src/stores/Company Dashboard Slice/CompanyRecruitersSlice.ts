import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyRecruiters, CompanyRecruitersFilter, RecruiterNames } from "../../types/companyDashboard";
const API_BASE_URL = config.API_BASE_URL;
import { showErrorToast } from '../../util/errorHandler';

const authRefreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export interface CompanyRecruitersSlice {
    CompanyRecruiters: CompanyRecruiters[];
    RecruiterNames: RecruiterNames[];
    CompanyRecruitersPage: number;
    CompanyRecruitersHasMore: boolean;
    CompanyRecruitersIsLoading: boolean;
    CompanyRecruitersFilters: CompanyRecruitersFilter;
    CompanyRecruiterId: number | null;
    
    CompanyRecruitersSetFilters: (filters: Partial<CompanyRecruitersFilter>) => Promise<void>;
    CompanyRecruitersFetchRecruiters: () => Promise<void>;
    ResetCompanyRecruiters: () => void;
    CompanyRecruitersDelete: (recruiterId: number) => Promise<void>;
    CompanyRecruiterFetchAllRecruiters: () => Promise<void>;
    CompanyRecruiterSetId: (recruiterId: number | null) => void;
    CompanyRecruitersAdd: (email: string, department: string, deadline: string) => Promise<void>;
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
        sorted: undefined,
    },
    RecruiterNames: [],
    CompanyRecruiterId: null,

    CompanyRecruitersAdd: async (email, department, deadline) => {
        set({ CompanyRecruitersIsLoading: true });
        try {
            const response = await axios.post(
                `${API_BASE_URL}/invitations`,
                {
                    recruiterEmail: email,
                    department,
                    deadline,
                },
                { withCredentials: true }
            );
            
            if (response.status === 200) {
                set((state) => ({
                    CompanyRecruiters: [
                        ...state.CompanyRecruiters,
                        response.data.recruiter,
                    ],
                }));
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyRecruitersAdd(email, department, deadline);
                    }
                }
                
                const errorMessage = err.response?.status === 404 
                    ? "Recruiter email not found." 
                    : "Something went wrong. Please try again.";
                
                await showErrorToast(errorMessage);
                console.error("Error adding recruiter:", err);
                throw new Error(errorMessage);
            }
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },

    CompanyRecruiterSetId: (recruiterId) => {
        set({ CompanyRecruiterId: recruiterId });
    },
    
    CompanyRecruitersSetFilters: async (newFilters) => {
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
        const { CompanyRecruitersPage, CompanyRecruitersHasMore, CompanyRecruitersIsLoading } = get();
        if (!CompanyRecruitersHasMore || CompanyRecruitersIsLoading) return;
        
        set({ CompanyRecruitersIsLoading: true });
        try {
            const { CompanyRecruitersFilters } = get();
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
                    withCredentials: true
                }
            );
            
            const data = response.data.recruiters;
            set((state) => ({
                CompanyRecruiters: [
                    ...state.CompanyRecruiters,
                    ...data,
                ],
                CompanyRecruitersHasMore: data.length > 0,
                CompanyRecruitersPage: state.CompanyRecruitersPage + 1,
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyRecruitersFetchRecruiters();
                    }
                }
            }
            console.error("Error fetching recruiters:", err);
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
                sorted: undefined,
            },
            RecruiterNames: [],
            CompanyRecruiterId: null,
        });
    },

    CompanyRecruitersDelete: async (recruiterId) => {
        set({ CompanyRecruitersIsLoading: true });
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/recruiters/${recruiterId}`,
                { withCredentials: true }
            );
            
            if (response.status === 200) {
                set((state) => ({
                    CompanyRecruiters: state.CompanyRecruiters.filter(
                        (recruiter) => recruiter.id !== recruiterId
                    ),
                }));
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyRecruitersDelete(recruiterId);
                    }
                }
            }
            console.error("Error deleting recruiter:", err);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },

    CompanyRecruiterFetchAllRecruiters: async () => {
        set({ CompanyRecruitersIsLoading: true });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/recruiters`,
                { withCredentials: true }
            );
            
            set({
                RecruiterNames: response.data.recruiters,
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyRecruiterFetchAllRecruiters();
                    }
                }
            }
            console.error("Error fetching recruiters:", err);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },
});