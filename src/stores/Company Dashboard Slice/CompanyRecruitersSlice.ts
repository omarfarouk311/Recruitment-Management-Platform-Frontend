import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyRecruiters, CompanyRecruitersFilter, RecruiterNames } from "../../types/companyDashboard";
const API_BASE_URL = config.API_BASE_URL;
import { showErrorToast } from '../../util/errorHandler';


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
    CompanyRecruitersAdd(email: string, department: string, deadline: string): Promise<void>;
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
            console.log("email", email);
            console.log("department", department);
            console.log("deadline", deadline);
            const response = await axios.post(
                `${API_BASE_URL}/invitations`,
                {
                    recruiterEmail:email,
                    department,
                    deadline,
                }
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
                 let errorMessage = "Something went wrong. Please try again.";

                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    errorMessage = "Recruiter email not found.";
                }
              
                const error =  new Error(errorMessage); // Throw error to be caught by component
                showErrorToast(
                    error.message
                );
            
            console.error("Error adding recruiter:", error);
        } finally {
            set({ CompanyRecruitersIsLoading: false });
        }
    },
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


