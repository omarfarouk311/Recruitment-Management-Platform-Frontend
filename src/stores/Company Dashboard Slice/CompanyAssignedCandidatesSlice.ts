import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyAssignedCandidates, CompanyAssignedCandidatesFilters } from "../../types/companyDashboard";
const API_BASE_URL = config.API_BASE_URL;
import { authRefreshToken } from "../../util/authUtils";


export interface CompanyAssignedCandidatesSlice {
    CompanyAssignedCandidates: CompanyAssignedCandidates[];
    CompanyAssignedCandidatesPage: number;
    CompanyAssignedCandidatesHasMore: boolean;
    CompanyAssignedCandidatesIsLoading: boolean;
    CompanyAssignedCandidatesFilters: CompanyAssignedCandidatesFilters;
    CompanyAssignedCandidatesPhases: { value: string; label: string }[];

    CompanyAssignedCandidatesJobTitles: { value: string; label: string }[];

    CompanyAssignedCandidatesSetFilters: (
        filters: Partial<CompanyAssignedCandidatesFilters>
    ) => Promise<void>;

    CompanyAssignedCandidatesFetchCandidates: () => Promise<void>;
    ResetCompanyAssignedCandidates: () => void;
    CompanyAssignedCandidatesUnAssign: (jobId: (number | null), candidate: number) => Promise<void>;
    CompanyAssignedCandidatesFetchJobTitles: () => Promise<void>;
    CompanyAssignedCandidatesFetchPhases: () => Promise<void>;

}

export const createCompanyAssignedCandidatesSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyAssignedCandidatesSlice
> = (set, get) => ({
    CompanyAssignedCandidates: [],
    CompanyAssignedCandidatesPage: 1,
    CompanyAssignedCandidatesHasMore: true,
    CompanyAssignedCandidatesIsLoading: false,
    CompanyAssignedCandidatesFilters: {
        phaseType: "",
        jobTitle: "",
    },
    CompanyAssignedCandidatesPhases: [],
    CompanyAssignedCandidatesJobTitles: [],


    CompanyAssignedCandidatesSetFilters: async (newFilters) => {
        set((state: CombinedState) => ({
            CompanyAssignedCandidatesFilters: {
                ...state.CompanyAssignedCandidatesFilters,
                ...newFilters,
            },
            CompanyAssignedCandidates: [],
            CompanyAssignedCandidatesPage: 1,
            CompanyAssignedCandidatesHasMore: true,
        }));
        await get().CompanyAssignedCandidatesFetchCandidates();
    },

    CompanyAssignedCandidatesFetchCandidates: async () => {
    const { CompanyAssignedCandidatesHasMore, CompanyAssignedCandidatesIsLoading, CompanyAssignedCandidatesPage, CompanyAssignedCandidatesFilters } = get();
    if (!CompanyAssignedCandidatesHasMore || CompanyAssignedCandidatesIsLoading) return;
    set({ CompanyAssignedCandidatesIsLoading: true });
    
    try {
        const recruiterId = get().CompanyRecruiterId;

        const params = {
            page: CompanyAssignedCandidatesPage,
            phaseType: CompanyAssignedCandidatesFilters.phaseType,
            jobTitle: CompanyAssignedCandidatesFilters.jobTitle,
            recruiterId: recruiterId,
        };
        
        // Remove empty values from params
        Object.keys(params).forEach(key => {
            if (params[key as keyof typeof params] === "") {
                delete params[key as keyof typeof params];
            }
        });

        const response = await axios.get(`${API_BASE_URL}/candidates/recruiter`, {
            params,
            withCredentials: true
        });
        
        const data = response.data;
        
        set((state: CombinedState) => {
            const candidates = Array.isArray(data) ? data : [];
            
            return {
                CompanyAssignedCandidates: [
                    ...state.CompanyAssignedCandidates,
                    ...candidates.map((candidate) => ({
                        job_seeker_id: candidate.seekerId,
                        job_seeker_name: candidate.seekerName,
                        job_title: candidate.jobTitle,
                        job_id: candidate.jobId,
                        phase_name: candidate.phase
                    }))
                ],
                CompanyAssignedCandidatesPage: state.CompanyAssignedCandidatesPage + 1,
                CompanyAssignedCandidatesHasMore: candidates.length > 0,
                CompanyAssignedCandidatesIsLoading: false,
            };
        });
    } catch (err) {
        set({ CompanyAssignedCandidatesIsLoading: false });
        
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
                return set({ CompanyAssignedCandidatesHasMore: false });
            } 
            else if (err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().CompanyAssignedCandidatesFetchCandidates();
                }
            }
        }
        
        console.error("Error fetching candidates:", err);
     }
    },

    ResetCompanyAssignedCandidates: () => {
        set({
            CompanyAssignedCandidates: [],
            CompanyAssignedCandidatesPage: 1,
            CompanyAssignedCandidatesHasMore: true,
            CompanyAssignedCandidatesIsLoading: false,
            CompanyAssignedCandidatesFilters: {
                phaseType: "",
                jobTitle: "",
            },
        });
    },
CompanyAssignedCandidatesUnAssign: async (jobId: (number | null), candidateId: number) => {
    set({ CompanyAssignedCandidatesIsLoading: true });
    try {
        const response = await axios.patch(`${API_BASE_URL}/candidates/unassign-candidates`, {
            jobId: jobId,
            candidates: [candidateId],
        }, {
            withCredentials: true  // Added credentials
        });

        if (response.status === 200) {
            set((state: CombinedState) => ({
                CompanyAssignedCandidates: state.CompanyAssignedCandidates.filter(
                    (candidate) => candidate.job_seeker_id !== candidateId
                ),
            }));
        }
        console.log("Unassigned candidates successfully:", response.data);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().CompanyAssignedCandidatesUnAssign(jobId, candidateId);  // Recursive retry
                }
            }
        }
        console.error("Error unassigning candidates:", err);
    } finally {
        set({ CompanyAssignedCandidatesIsLoading: false });
    }
},

    CompanyAssignedCandidatesFetchJobTitles: async () => {
    const { userId } = get();
    try {
        const response = await axios.get(`${API_BASE_URL}/companies/${userId}/jobs?page=1&filterBar=true`, {
            withCredentials: true  // Added credentials
        });
        const jobs = response.data.map((job: { id: number; title: string }) => ({ 
            value: job.title, 
            label: job.title 
        }));

        set({ CompanyAssignedCandidatesJobTitles: jobs });
        console.log("Job titles fetched successfully:", jobs);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().CompanyAssignedCandidatesFetchJobTitles();  // Recursive retry
                }
            }
        }
        console.error("Error fetching job titles:", err);
    }
},

    CompanyAssignedCandidatesFetchPhases: async () => {
    try {
        const res = await axios.get(`${config.API_BASE_URL}/candidates/phase-types`, {
            withCredentials: true  // Added credentials
        });
        
        const phases = res.data.map((phaseType: { id: number; name: string }) => ({ 
            value: phaseType.id, 
            label: phaseType.name 
        }));
        
        set({
            CompanyAssignedCandidatesPhases: phases,
        });
        
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().CompanyAssignedCandidatesFetchPhases();  // Recursive retry
                }
            }
        }
        console.error("Error fetching phase types:", err);
    }
},
    CompanyAssignedCandidatesClear: () => {
        set({
            CompanyAssignedCandidates: [],
            CompanyAssignedCandidatesPage: 1,
            CompanyAssignedCandidatesHasMore: true,
            CompanyAssignedCandidatesIsLoading: false,
            CompanyAssignedCandidatesFilters: {
                phaseType: "",
                jobTitle: "",
            },
            CompanyAssignedCandidatesPhases: [],
            CompanyAssignedCandidatesJobTitles: [],

        });
    },
});
