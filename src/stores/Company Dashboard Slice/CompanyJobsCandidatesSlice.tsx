import { useEffect } from "react";
import { StateCreator } from "zustand";
import { CombinedState } from "../../stores/storeTypes";
import axios from "axios";
import config from "../../../config/config";
import { CompanyCandidates, CompanyCandidateFilters } from "../../types/candidates";
import { formatDistanceToNow } from "date-fns";



export interface CompanyCandidatesSlice {
    Companycandidates: CompanyCandidates[];
    CompanyCandidatesPage: number;
    CompanyCandidatesHasMore: boolean;
    CompanyCandidatesIsLoading: boolean;
    CompanyCandidatesFilters: CompanyCandidateFilters;
    CompanyCandidatesPhases: { value: string; label: string }[];
    CurrentJobId: number ;

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

    CompanyCandidatesSetFilters: async (newFilters) => {
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

    CompanyCandidatesMakeDecision: async (seekerId, decision, jobId) => {
        let res = await axios.post(
            `${config.API_BASE_URL}/candidates/make-decision`,
            { jobId, decision, candidates: [seekerId] }
        );
        if (res.status !== 200) {
            throw Error("Error in making decision");
        }
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
                phaseType: CompanyCandidatesFilters.phaseType || undefined,
                country: CompanyCandidatesFilters.candidateCountry || undefined,
                city: CompanyCandidatesFilters.candidateCity || undefined,
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
    }
});
