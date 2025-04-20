import { useEffect } from "react";
import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyCandidates, CompanyCandidateFilters } from "../../types/candidates";



export interface CompanyCandidatesSlice {
    Companycandidates: CompanyCandidates[];
    CompanyCandidatesPage: number;
    CompanyCandidatesHasMore: boolean;
    CompanyCandidatesIsLoading: boolean;
    CompanyCandidatesFilters: CompanyCandidateFilters;
    CompanyCandidatesPhases: { value: string; label: string }[];
    CurrentJobId: number;
    
    selectedCandidates: number[];

    CompanyCandidatesSetCurrentJobId: (id: number) => void;
    CompanyCandidatesSetFilters: (
        filters: Partial<CompanyCandidateFilters>
    ) => Promise<void>;
    CompanyCandidatesFetchCandidates: () => Promise<void>;
    CompanyCandidatesSetPhases: () => Promise<void>;
    ResetCompanyCandidates: () => void;
    CompanyCandidatesMakeDecision: (
        seekerIds: number[],
        decision: boolean,
        jobId: number
    ) => Promise<void>;
    setSelectedCandidates: (updater: number) => void;
    CompanyCandidateUnAssign: (jobId: (number | null), candidates: number[]) => Promise<void>;

}

export const createCompanyCandidatesSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyCandidatesSlice
> = (set, get) => ({
    Companycandidates: [],
    CompanyCandidatesPage: 1,
    CompanyCandidatesHasMore: true,
    CompanyCandidatesIsLoading: false,
    CompanyCandidatesFilters: {
        candidateCountry: "",
        candidateCity: "",
        phaseType: "",
        status: "",
        sortBy: ""
    },
    CompanyCandidatesPhases: [],
    CurrentJobId: 0,
    selectedCandidates: [],

    setSelectedCandidates: (seekerId) => {
        const { selectedCandidates } = get()
        if (selectedCandidates.includes(seekerId)) {
            set({ selectedCandidates: selectedCandidates.filter(id => id !== seekerId) }) 
        }
        else {
            set((state) => {
                const updated = [...state.selectedCandidates, seekerId];
                return { selectedCandidates: updated };
            });
        }
    },
    CompanyCandidatesSetFilters: async (newFilters) => {
        console.log(newFilters)
        set((state: CombinedState) => ({
            CompanyCandidatesFilters: {
                ...state.CompanyCandidatesFilters,
                ...newFilters,
            },
            Companycandidates: [],
            CompanyCandidatesPage: 1,
            CompanyCandidatesHasMore: true,
        }));
        await get().CompanyCandidatesFetchCandidates();
    },

    ResetCompanyCandidates() {
        set({
            Companycandidates: [],
            CompanyCandidatesPage: 1,
            CompanyCandidatesHasMore: true,
            CompanyCandidatesIsLoading: false,
            CompanyCandidatesFilters: {
                candidateCountry: "",
                candidateCity: "",
                phaseType: "",
                sortBy: "",
                status: ""
            },
            CompanyCandidatesPhases: [],
            CurrentJobId: 0
        });
    },

    CompanyCandidatesMakeDecision: async (seekerIds, decision, jobId) => {
        console.log(seekerIds, decision, jobId)
        let res = await axios.post(
            `${config.API_BASE_URL}/candidates/make-decision`,
            { jobId, decision, candidates: seekerIds }
        );
        if (res.status !== 200) {
            throw Error("Error in making decision");
            
        }
        set((state: CombinedState) => ({
            CompanyCandidatesFilters: {
                ...state.CompanyCandidatesFilters,
            },
            Companycandidates: [],
            CompanyCandidatesPage: 1,
            CompanyCandidatesHasMore: true,
        }));
        await get().CompanyCandidatesFetchCandidates();

    },

    CompanyCandidatesFetchCandidates: async () => {
        const {
            CompanyCandidatesPage,
            CompanyCandidatesHasMore,
            CompanyCandidatesIsLoading,
            CompanyCandidatesFilters,
            CurrentJobId
        } = get();

        if (!CompanyCandidatesHasMore || CompanyCandidatesIsLoading) return;
        set({ CompanyCandidatesIsLoading: true });

        try {
            const params = {
                page: CompanyCandidatesPage,
                [CompanyCandidatesFilters.sortBy == '1' ? "sortByRecommendation" : "sortByAssessmentScore"]: CompanyCandidatesFilters.sortBy,
                phaseType: CompanyCandidatesFilters.phaseType || "",
                country: CompanyCandidatesFilters.candidateCountry || "",
                city: CompanyCandidatesFilters.candidateCity || "",
                status: CompanyCandidatesFilters.status || ""
            };

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }

            let res = await axios.get(
                `${config.API_BASE_URL}/candidates/job/${CurrentJobId}`,
                { params }
            );
            console.log(res.data)
            set((state: CombinedState) => ({
                Companycandidates: [
                    ...state.Companycandidates,
                    ...res.data.map((candidate: any) => ({
                        ...candidate
                    })),
                ],
                CompanyCandidatesHasMore: res.data.length > 0,
                CompanyCandidatesIsLoading: false,
                CompanyCandidatesPage: state.CompanyCandidatesPage + 1,
                selectedCandidates: []
            }));
            console.log("here")
        } catch (err) {
            set({ CompanyCandidatesIsLoading: false });
        }
    },
    CompanyCandidatesSetPhases: async () => {

        let res = await axios.get(
            `${config.API_BASE_URL}/candidates/phase-types`
        );
        const phases = res.data.map((phaseType: { id: number; name: string }) => ({ value: phaseType.id, label: phaseType.name }));
        set({
            CompanyCandidatesPhases: phases,
        });
    },
    CompanyCandidatesSetCurrentJobId: async (jobId) => {
        set({ CurrentJobId: jobId });
        const { CompanyCandidatesFetchCandidates } = get();
        await CompanyCandidatesFetchCandidates();
    },
    CompanyCandidateUnAssign: async (jobId, candidates) => {
        set({ CompanyCandidatesIsLoading: true });

        try {
            set({ CompanyCandidatesIsLoading: true });

            // 1. Unassign candidates
            const res = await axios.patch(
                `${config.API_BASE_URL}/candidates/unassign-candidates`,
                { jobId, candidates }
            );

            if (res.status >= 400) {
                throw new Error(res.data?.message || "Error in unassigning candidates");
            }
            const params = {
                page: 1,
                name: get().CompanyJobsRecruitersFilters.recruiterName,
                department: get().CompanyJobsRecruitersFilters.department,
                sorted: get().CompanyJobsRecruitersFilters.assignedCandidates,
            };

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }

            // 2. Get updated recruiters list
            const response = await axios.get(`${config.API_BASE_URL}/recruiters`, {
                params
            });
            console.log(response)
            const data = response.data.recruiters || [];
            console.log(data)
            set((state) => {
                // Safely handle undefined/null state
                const currentCandidates = state.Companycandidates || [];

                return {
                    ...state,
                    Companycandidates: currentCandidates.map(candidate => {
                        // Skip if candidate is invalid
                        if (!candidate || !('seekerId' in candidate)) return candidate;

                        // Only update if candidate is in the unassign list
                        return candidates.includes(candidate.seekerId)
                            ? { ...candidate, recruiterName: "" }
                            : candidate;
                    }),
                    CompanyJobsRecruiters: data,
                    CompanyJobsRecruitersPage: 1,
                    CompanyJobsRecruitersHasMore: data.length > 0,
                    CompanyCandidatesIsLoading: false,
                    selectedCandidates: []
                };
            });

        } catch (err) {
            set({ CompanyCandidatesIsLoading: false });
            console.error("Unassign operation failed:", err);
            // Consider adding error state or toast notification
            throw err; // Only if you need to propagate
        }
    }
});
