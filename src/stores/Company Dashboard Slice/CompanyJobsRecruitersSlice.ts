import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyJobsRecruiters, CompanyJobsRecruitersFilters } from "../../types/company";
import { authRefreshToken } from "../../util/authUtils";
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
    CompanyJobsRecruitersAssign: (recruiterId: number, recruiterName: string, jobId: (number | null), candidates: number[]) => Promise<void>;
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
        console.log(newFilters);
        set((state: CombinedState) => ({
            CompanyJobsRecruitersFilters: {
                ...state.CompanyJobsRecruitersFilters,
                ...newFilters,
            },
            CompanyJobsRecruiters: [],
            CompanyJobsRecruitersPage: 1,
            CompanyJobsRecruitersHasMore: true,
            CompanyJobsRecruitersIsLoading: false,
        }));
        await get().CompanyJobsRecruitersFetchRecruiters();
    },

    CompanyJobsRecruitersFetchRecruiters: async () => {
        const { CompanyJobsRecruitersPage, CompanyJobsRecruitersHasMore, CompanyJobsRecruitersIsLoading } = get();

        if (!CompanyJobsRecruitersHasMore || CompanyJobsRecruitersIsLoading) return;

        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const { CompanyJobsRecruitersFilters } = get();
            const cleanedFilters = Object.fromEntries(
                Object.entries(CompanyJobsRecruitersFilters).filter(
                    ([_, value]) => value !== "" && value !== undefined && value !== null
                )
            );

            const response = await axios.get(
                `${API_BASE_URL}/recruiters`,
                {
                    params: {
                        page: CompanyJobsRecruitersPage,
                        ...cleanedFilters,
                        name: cleanedFilters.recruiterName,
                        sorted: cleanedFilters.assignedCandidates,
                    },
                    withCredentials: true
                }
            );
            console.log("Response data:", response.data);
            const data = response.data.recruiters;
            set((state: CombinedState) => ({
                CompanyJobsRecruiters: [...state.CompanyJobsRecruiters, ...data],
                CompanyJobsRecruitersPage: state.CompanyJobsRecruitersPage + 1,
                CompanyJobsRecruitersHasMore: data.length === config.paginationLimit,
                CompanyJobsRecruitersIsLoading: false,
            }));
        } catch (err) {
            set({ CompanyJobsRecruitersIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyJobsRecruitersFetchRecruiters();
                    }
                }
            }
            console.error("Error fetching recruiters:", err);
        }
    },

    CompanyJobsRecruitersFetchRecruitersNames: async () => {
        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/recruiters/allRecruiters`,
                { withCredentials: true }
            );
            const namesArray = response.data.map((item: { name: string }) => item.name);
            set({ 
                CompanyRecruiterNames: namesArray,
                CompanyJobsRecruitersIsLoading: false 
            });
        } catch (err) {
            set({ CompanyJobsRecruitersIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyJobsRecruitersFetchRecruitersNames();
                    }
                }
            }
            console.error("Error fetching recruiters names:", err);
            throw err;
        }
    },

    CompanyJobsRecruitersFetchDepartments: async () => {
        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/recruiters/departments`,
                { withCredentials: true }
            );
            const departmentArray = response.data.result.map((item: { department: string }) => item.department);
            set({ 
                CompanyJobsRecruitersDepartments: departmentArray,
                CompanyJobsRecruitersIsLoading: false 
            });
        } catch (err) {
            set({ CompanyJobsRecruitersIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyJobsRecruitersFetchDepartments();
                    }
                }
            }
            console.error("Error fetching departments:", err);
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

    CompanyJobsRecruitersAssign: async (recruiterId, recruiterName, jobId, candidates) => {
        set({ CompanyJobsRecruitersIsLoading: true });
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/candidates/assign-candidates`,
                {
                    recruiterId,
                    jobId,
                    candidates,
                },
                { withCredentials: true }
            );

            if (res.status !== 200) {
                throw new Error("Error in assigning candidates");
            }

            const { assignedCandidatesCnt: newCount, invalidCandidates = [] } = res.data;
            set((state) => {
                const validCandidates = candidates.filter(
                    candidateId => !invalidCandidates.includes(candidateId)
                );

                return {
                    CompanyJobsRecruiters: state.CompanyJobsRecruiters.map(recruiter =>
                        recruiter.id === recruiterId
                            ? { ...recruiter, assigned_candidates_cnt: newCount }
                            : recruiter
                    ),
                    Companycandidates: state.Companycandidates.map(candidate =>
                        validCandidates.includes(candidate.seekerId)
                            ? {
                                ...candidate,
                                recruiterName,
                                recruiterId
                              }
                            : candidate
                    ),
                    selectedCandidates: [],
                    selectedRecruiters: new Map(),
                    CompanyJobsRecruitersIsLoading: false
                };
            });
        } catch (err) {
            set({ CompanyJobsRecruitersIsLoading: false });
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().CompanyJobsRecruitersAssign(recruiterId, recruiterName, jobId, candidates);
                    }
                }
            }
            console.error("Error assigning candidates:", err);
            throw err;
        }
    },
});