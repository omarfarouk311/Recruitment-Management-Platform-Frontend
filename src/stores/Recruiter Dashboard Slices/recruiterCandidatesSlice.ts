import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Candidate, CandidateFilters } from "../../types/candidates";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config";
import { showErrorToast } from "../../util/errorHandler";

export interface RecruiterCandidatesSlice {
    Recruitercandidates: Candidate[];
    RecruiterCandidatesPage: number;
    RecruiterCandidatesHasMore: boolean;
    RecruiterCandidatesIsLoading: boolean;
    RecruiterCandidatesFilters: CandidateFilters;
    RecruiterCandidatesPositionTitles: { value: string; label: string }[];
    RecruiterCandidatesPhases:{ value: string; label: string }[];

    RecruiterCandidatesSetFilters: (
        filters: Partial<CandidateFilters>
    ) => Promise<void>;
    RecruiterCandidatesFetchCandidates: () => Promise<void>;
    RecruiterCandidatesSetPositionTitles: () => Promise<void>;
    RecruiterCandidatesSetPhases: () => Promise<void>;
    ResetRecruiterCandidates: () => void;
    RecruiterCandidatesMakeDecision: (
        seekerId: number,
        decision: boolean,
        jobId: number
    ) => Promise<void>;
}

export const createRecruiterCandidatesSlice: StateCreator<
    CombinedState,
    [],
    [],
    RecruiterCandidatesSlice
> = (set, get) => ({
    Recruitercandidates: [],
    RecruiterCandidatesPage: 1,
    RecruiterCandidatesHasMore: true,
    RecruiterCandidatesIsLoading: false,
    RecruiterCandidatesFilters: {
        candidateCity: "",
        candidateCountry: "",
        phaseType: "",
        jobTitle: "",
        sortBy: "",
    },
    RecruiterCandidatesPositionTitles: [],
    RecruiterCandidatesPhases: [],

    RecruiterCandidatesSetFilters: async (newFilters) => {
        set((state: CombinedState) => ({
            RecruiterCandidatesFilters: {
                ...state.RecruiterCandidatesFilters,
                ...newFilters,
            },
            Recruitercandidates: [],
            RecruiterCandidatesPage: 1,
            RecruiterCandidatesHasMore: true,
        }));
        await get().RecruiterCandidatesFetchCandidates();
    },

    ResetRecruiterCandidates() {
        set({
            Recruitercandidates: [],
            RecruiterCandidatesPage: 1,
            RecruiterCandidatesHasMore: true,
            RecruiterCandidatesIsLoading: false,
            RecruiterCandidatesFilters: {
                candidateCity: "",
                candidateCountry: "",
                phaseType: "",
                jobTitle: "",
                sortBy: "",
            },
            RecruiterCandidatesPositionTitles: [],
        });
    },

    RecruiterCandidatesMakeDecision: async (seekerId, decision, jobId) => {
        try{
            let res = await axios.post(
                `${config.API_BASE_URL}/candidates/make-decision`,
                { jobId, decision, candidates: [seekerId] }
            );

            const { Recruitercandidates } = get();
            const updatedCandidates = Recruitercandidates.filter((candidate) => {
                if (candidate.seekerId === seekerId && candidate.jobId === jobId) {
                    return false;
                }
                return true;
            });
            set({ Recruitercandidates: updatedCandidates });

        }
        catch (err) {
            if(axios.isAxiosError(err)) {
                showErrorToast("Error making decision");
            }
        }
    },

    RecruiterCandidatesFetchCandidates: async () => {
        const {
            RecruiterCandidatesPage,
            RecruiterCandidatesHasMore,
            RecruiterCandidatesIsLoading,
            RecruiterCandidatesFilters,
        } = get();

        if (!RecruiterCandidatesHasMore || RecruiterCandidatesIsLoading) return;
        set({ RecruiterCandidatesIsLoading: true });

        try {
            //Simplified will always be false
            const params = {
                page: RecruiterCandidatesPage,
                jobTitle: RecruiterCandidatesFilters.jobTitle || undefined,
                phaseType: RecruiterCandidatesFilters.phaseType || undefined,
                sortBy: RecruiterCandidatesFilters.sortBy || undefined,
                simplified: false,
            };

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === undefined) {
                    delete params[key as keyof typeof params];
                }
            }

            let res = await axios.get(
                `${config.API_BASE_URL}/candidates/recruiter`,
                { params }
            );

            set((state: CombinedState) => ({
                Recruitercandidates: [
                    ...state.Recruitercandidates,
                    ...res.data.map((candidate: Candidate) => ({
                        ...candidate,
                        dateApplied: formatDistanceToNow(
                            new Date(candidate.dateApplied),
                            { addSuffix: true }
                        ),
                    })),
                ],
                RecruiterCandidatesHasMore: res.data.length > 0,
                RecruiterCandidatesIsLoading: false,
                RecruiterCandidatesPage: state.RecruiterCandidatesPage + 1,
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                showErrorToast("Something went wrong");
            }
            set({ RecruiterCandidatesIsLoading: false });
        }
    },

    RecruiterCandidatesSetPositionTitles: async () => {
        try{
            const {
                RecruiterCandidatesFilters,
              } = get();
      
                //Simplified will always be false
                const params = {
                    jobTitle: RecruiterCandidatesFilters.jobTitle || undefined,      
                };
      
                // Remove undefined values from params
                for (const key in params) {
                    if (params[key as keyof typeof params] === undefined) {
                        delete params[key as keyof typeof params];
                    }
                }
      
                let res = await axios.get(
                    `${config.API_BASE_URL}/candidates/job-title-filter`,
                    { params }
                );
      
              const positionTitles =res.data.jobTitle.map((jobTitle:string) => ({value: jobTitle, label: jobTitle}));
              set({
                  RecruiterCandidatesPositionTitles: positionTitles,
              });
        }
        catch(err){
            if(axios.isAxiosError(err)) {
                showErrorToast("Something went wrong");
            }
        }
        
    },

    RecruiterCandidatesSetPhases: async() => {
        try{
            let res = await axios.get(
                `${config.API_BASE_URL}/candidates/phase-types`
            );
            const phases = res.data.map((phaseType:{id:number; name:string}) => ({value: phaseType.id, label: phaseType.name}));
            set({
                RecruiterCandidatesPhases: phases,
            });
        }
        catch(err){
            if(axios.isAxiosError(err)) {
                showErrorToast("Something went wrong");
            }
        }
        
    },
});
