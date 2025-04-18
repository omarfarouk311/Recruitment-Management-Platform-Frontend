import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyJobsRecruiters, CompanyJobsRecruitersFilters } from "../../types/company";
const API_BASE_URL = config.API_BASE_URL;


export interface CompanyJobsRecruitersSlice {
    CompanyJobsRecruiters: CompanyJobsRecruiters[];
    CompanyJobsRecruitersPage: number;
    CompanyJobsRecruitersHasMore: boolean;
    CompanyJobsRecruitersIsLoading: boolean;
    CompanyJobsRecruitersFilters: CompanyJobsRecruitersFilters;
    CompanyRecruiterNames: string[];
    CompanyJobsRecruitersDepartments: string[];

    CompanyJobsRecruitersSetFilters: (
        filters: Partial<CompanyJobsRecruitersFilters>
    ) => Promise<void>;
    CompanyJobsRecruitersFetchRecruiters: () => Promise<void>;
    CompanyJobsRecruitersFetchRecruitersNames: () => Promise<void>;
    CompanyJobsRecruitersFetchDepartments: () => Promise<void>;

    CompanyJobsRecruitersClear: () => void;
    CompanyJobsRecruitersAssign: (recruiterId: number, jobId:(number | null), candidates: number[]) => Promise<void>;
}

export const createCompanyJobsRecruitersSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyJobsRecruitersSlice
> = (set, get) => ({
    CompanyJobsRecruiters: [],
    CompanyJobsRecruitersPage: 1,
    CompanyJobsRecruitersHasMore: true,
    CompanyJobsRecruitersIsLoading: false,
    CompanyJobsRecruitersDepartments: [],
    CompanyJobsRecruitersFilters: {
        recruiterName: "",
        department: "",
        assignedCandidates: ""
    },
    CompanyRecruiterNames: [],
    
    CompanyJobsRecruitersSetFilters: async (newFilters) => {
        console.log(newFilters)
        set((state: CombinedState) => ({
            CompanyJobsRecruitersFilters: {
                ...state.CompanyJobsRecruitersFilters,
                ...newFilters,
            },
            CompanyJobsRecruiters: [],
            CompanyJobsRecruitersPage: 1,
            CompanyJobsRecruitersHasMore: true,
        }));
        await get().CompanyJobsRecruitersFetchRecruiters();
    },

    CompanyJobsRecruitersFetchRecruiters: async () => {
        const { CompanyJobsRecruitersPage, CompanyJobsRecruitersFilters } = get();

        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const params = {
                page: CompanyJobsRecruitersPage,
                name: CompanyJobsRecruitersFilters.recruiterName,
                department: CompanyJobsRecruitersFilters.department,
                sorted: CompanyJobsRecruitersFilters.assignedCandidates,
            };

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }
            
            const response = await axios.get(
                `${API_BASE_URL}/recruiters`,
                {
                   params,
                }
            );
            const data = response.data.recruiters;
            console.log(data)
            set((state: CombinedState) => ({
                CompanyJobsRecruiters: [...state.CompanyJobsRecruiters, ...data],
                CompanyJobsRecruitersPage: CompanyJobsRecruitersPage + 1,
                CompanyJobsRecruitersHasMore: data.length > 0,
            }));
        }
        catch (error) {
            console.error("Error fetching recruiters:", error);
        } finally {
            set({ CompanyJobsRecruitersIsLoading: false });
        }
    },
    CompanyJobsRecruitersFetchRecruitersNames: async () => {
        set({ CompanyJobsRecruitersIsLoading: true });
        try {

            const response = await axios.get(
                `${API_BASE_URL}/recruiters/allRecruiters`
            ) 
            const data = response.data;
            const namesArray = data.map((item: { name: string }) => item.name); // Replace 'name' with your actual property name

            set({ CompanyRecruiterNames: namesArray });
            set({ CompanyJobsRecruitersIsLoading: false });
        } catch (error) {
            console.error("Error fetching recruiters names:", error);
            throw error;
        }
        
    },
    CompanyJobsRecruitersFetchDepartments: async () => {
        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/recruiters/departments`
            );
            const data = response.data.result;
            console.log(data)
            const departmentArray = data.map((item: { department: string }) => item.department); 

            set({ CompanyJobsRecruitersDepartments: departmentArray });
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            set({ CompanyJobsRecruitersIsLoading: false });
        }
    },
    CompanyJobsRecruitersClear: () => {
        set({
            CompanyJobsRecruiters: [],
            CompanyJobsRecruitersPage: 1,
            CompanyJobsRecruitersHasMore: true,
            CompanyJobsRecruitersIsLoading: false,
            CompanyJobsRecruitersFilters: {
                recruiterName: "",
                department: "",
                assignedCandidates: ""
            },
            CompanyRecruiterNames: [],
            CompanyJobsRecruitersDepartments: [],
        });
    },
    CompanyJobsRecruitersAssign: async (recruiterId, jobId, candidates) => {
        const res = await axios.post(
            `${config.API_BASE_URL}/candidates/assign-candidates`,
            {
                recruiterId,
                jobId,
                candidates,
            }
        );
        if (res.status !== 200) {
            throw Error("Error in making decision");
        }
        await get().CompanyJobsRecruitersFetchRecruiters();
    },
});
