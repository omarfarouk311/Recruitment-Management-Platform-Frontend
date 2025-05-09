import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyAssignedCandidates, CompanyAssignedCandidatesFilters } from "../../types/companyDashboard";
const API_BASE_URL = config.API_BASE_URL;


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
            }
            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }
            const response = await axios.get(`${API_BASE_URL}/candidates/recruiter`, { params });
            const data = response.data;
            console.log("params", params);
            console.log("response", data);
            set((state: CombinedState) => {
                // Safely handle cases where data might be undefined or null
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
                    // Check if candidates array has items for has_more
                    CompanyAssignedCandidatesHasMore: candidates.length > 0,
                    CompanyAssignedCandidatesIsLoading: false,
                };
            });
        } catch (error) {
            console.error("Error fetching candidates:", error);
            set({ CompanyAssignedCandidatesIsLoading: false });
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
            });
            if (response.status === 200) {
                set((state: CombinedState) => ({
                    CompanyAssignedCandidates: state.CompanyAssignedCandidates.filter(
                        (candidate) => candidate.job_seeker_id !== candidateId
                    ),
                }));
            }
            console.log("Unassigned candidates successfully:", response.data);
        } catch (error) {
            console.error("Error unassigning candidates:", error);
        }
        finally {
            set({ CompanyAssignedCandidatesIsLoading: false });
        }
    },

    CompanyAssignedCandidatesFetchJobTitles: async () => {
        const { userId } = get();
        try {
            const response = await axios.get(`${API_BASE_URL}/companies/${userId}/jobs?page=1&filterBar=true`);
            const jobs = response.data.map((job: { id: number; title: string }) => ({ value: job.title, label: job.title }));

            set({ CompanyAssignedCandidatesJobTitles: jobs });
            console.log("Job titles fetched successfully:", jobs);
        } catch (error) {
            console.error("Error fetching job titles:", error);
        }
    },

    CompanyAssignedCandidatesFetchPhases: async () => {

        let res = await axios.get(
            `${config.API_BASE_URL}/candidates/phase-types`
        );
        const phases = res.data.map((phaseType: { id: number; name: string }) => ({ value: phaseType.id, label: phaseType.name }));
        set({
            CompanyAssignedCandidatesPhases: phases,
        });

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
