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
    selectedRecruiters: Map<number, number>;


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
    setSelectedCandidates: (seekerId: number, recruiterId: number | undefined) => void;
    // setSelectedRecruiters: (seekerId: Map<number, number>) => void;

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
    selectedRecruiters: new Map<number, number>(),

    setSelectedCandidates: (seekerId, recruiterId) => {
        const { selectedCandidates, selectedRecruiters } = get();
        
        if (selectedCandidates.includes(seekerId)) {
            set({
                selectedCandidates: selectedCandidates.filter(id => id !== seekerId),
            });
            if(recruiterId) {
                set({ 
                selectedRecruiters: new Map(selectedRecruiters).set(
                    recruiterId,
                    (selectedRecruiters.get(recruiterId) ?? 0) - 1
                )
            })
            }
        } else {
            set((state) => ({
                selectedCandidates: [...state.selectedCandidates, seekerId],
            }));
            if(recruiterId) {
                set((state:CombinedState) => ({
                selectedRecruiters: new Map(state.selectedRecruiters).set(
                    recruiterId,
                    (state.selectedRecruiters.get(recruiterId) || 0) + 1
                )
            }))
        }
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
            CurrentJobId: 0,
            selectedCandidates: [],
            selectedRecruiters: new Map<number, number>(),
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
        console.log("heree")
        console.log(candidates)
        
        try {
            // 1. Unassign candidates
            const res = await axios.patch(
                `${config.API_BASE_URL}/candidates/unassign-candidates`,
                { jobId, candidates }
            );

            if (res.status >= 400) {
                throw new Error(res.data?.message || "Error in unassigning candidates");
            }

            set((state: CombinedState) => ({
                Companycandidates: state.Companycandidates.map(candidate => {
                    if (candidates.includes(candidate.seekerId)) {
                        return {
                            ...candidate,
                            recruiterName: '',
                            recruiterId: undefined // Assuming you also want to clear the recruiter ID
                        };
                    }
                    return candidate;
                }),
                CompanyCandidatesIsLoading: false,
                selectedCandidates: [],
            }));



            set((state: CombinedState) => {
            // Get the current selectedRecruiters Map from state
            const currentSelectedRecruiters = state.selectedRecruiters;
            
            return {
                CompanyJobsRecruiters: state.CompanyJobsRecruiters.map(recruiter => {
                    // Check if this recruiter exists in the selectedRecruiters Map
                    if (currentSelectedRecruiters.has(recruiter.id)) {
                        const countToSubtract = currentSelectedRecruiters.get(recruiter.id) || 0;
                        return {
                            ...recruiter,
                            assigned_candidates_cnt: Math.max(0, recruiter.assigned_candidates_cnt - countToSubtract)
                        };
                    }
                    return recruiter;
                }),
                // Clear the selectedRecruiters Map after applying the changes
                selectedRecruiters: new Map()
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
