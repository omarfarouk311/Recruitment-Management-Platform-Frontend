import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Candidate, CandidateFilters } from "../../types/candidates";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import config from "../../../config/config";
import { showErrorToast } from "../../util/errorHandler";
import { authRefreshToken } from "../../util/authUtils";

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
            await axios.post(
                `${config.API_BASE_URL}/candidates/make-decision`,
                { jobId, decision, candidates: [seekerId] },
                { withCredentials: true }
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
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().RecruiterCandidatesMakeDecision(seekerId, decision, jobId);
                    }
                } else if (err.response?.status === 404) {
                    return showErrorToast("Candidate not found");
                }
            }
            showErrorToast("Error making decision");
        }
    },

    RecruiterCandidatesFetchCandidates: async () => {
        const {
            RecruiterCandidatesPage,
            RecruiterCandidatesHasMore,
            RecruiterCandidatesFilters,
        } = get();

        if (!RecruiterCandidatesHasMore) return;
        set({ RecruiterCandidatesIsLoading: true });

        try {
            //Simplified will always be false
            const params = {
                page: RecruiterCandidatesPage,
                jobTitle: RecruiterCandidatesFilters.jobTitle || undefined,
                phaseType: RecruiterCandidatesFilters.phaseType || undefined,
                sortBy: RecruiterCandidatesFilters.sortBy || undefined,
                simplified: false,
                city: RecruiterCandidatesFilters.candidateCity || undefined,
                country: RecruiterCandidatesFilters.candidateCountry || undefined,
            };

            // Remove undefined values from params
            for (const key in params) {
                if (params[key as keyof typeof params] === undefined || params[key as keyof typeof params] === "") {
                    delete params[key as keyof typeof params];
                }
            }

            let res = await axios.get(
                `${config.API_BASE_URL}/candidates/recruiter`,
                { params, withCredentials: true }
            );
            
            set((state) => ({
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
                RecruiterCandidatesHasMore: res.data.length === config.paginationLimit,
                RecruiterCandidatesIsLoading: false,
                RecruiterCandidatesPage: state.RecruiterCandidatesPage + 1,
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().RecruiterCandidatesFetchCandidates();
                    }
                } else if (err.response?.status === 404) {
                    set({ RecruiterCandidatesHasMore: false });
                    return showErrorToast("No candidates found");
                }
            }
            
            showErrorToast("Error fetching candidates");
        }
        finally {
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
                    { params, withCredentials: true }
                );
                
              const positionTitles =res.data.map((jobTitle:string) => ({value: jobTitle, label: jobTitle}));
              set({
                  RecruiterCandidatesPositionTitles: positionTitles,
              });
        }
        catch(err){
            if(axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().RecruiterCandidatesSetPositionTitles();
                    }
                }
            }
            showErrorToast("Something went wrong while fetching position titles");
        }
        
    },

    RecruiterCandidatesSetPhases: async() => {
        try{
            let res = await axios.get(
                `${config.API_BASE_URL}/candidates/phase-types`,
                { withCredentials: true }
            );
            const phases = res.data.map((phaseType:{id:number; name:string}) => ({value: phaseType.id, label: phaseType.name}));
            set({
                RecruiterCandidatesPhases: phases,
            });
        }
        catch(err){
            if(axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().RecruiterCandidatesSetPhases();
                    }
                }
            }
            showErrorToast("Something went wrong while fetching phases");
        }
        
    },
});
