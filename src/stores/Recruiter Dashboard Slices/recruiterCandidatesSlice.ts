import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Candidate, CandidateFilters } from "../../types/candidates";
import { mockDetailedJobs } from "../../mock data/seekerForYou";
import { candidatesMockData} from "../../mock data/recruiterDashboard";
import { formatDistanceToNow } from "date-fns";

export interface RecruiterCandidatesSlice {
  Recruitercandidates: Candidate[];
  RecruiterCandidatesPage: number;
  RecruiterCandidatesHasMore: boolean;
  RecruiterCandidatesIsLoading: boolean;
  RecruiterCandidatesFilters: CandidateFilters;
  RecruiterCandidatesPositionTitles: {value: string, label: string}[];
  
  RecruiterCandidatesSetFilters: (filters: Partial<CandidateFilters>) => Promise<void>;
  RecruiterCandidatesFetchCandidates: () => Promise<void>;
  RecruiterCandidatesSetPositionTitles: () => Promise<void>;
  RecruiterCandidatesMakeDecision: (seekerId: number, decision:boolean , jobId:number) => Promise<void>;
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
    candidateCity: '',
    candidateCountry: '',
    phaseType: '',
    jobTitle: '',
    sortBy: 'date_applied'
  },
  RecruiterCandidatesPositionTitles: [],

  RecruiterCandidatesSetFilters: async (newFilters) => {
    set((state: CombinedState) => ({
      RecruiterCandidatesFilters: { 
        ...state.RecruiterCandidatesFilters, 
        ...newFilters 
      },
      Recruitercandidates: [],
      RecruiterCandidatesPage: 1,
      RecruiterCandidatesHasMore: true
    }));
    await get().RecruiterCandidatesFetchCandidates();
  },

  RecruiterCandidatesMakeDecision: async (seekerId, decision, jobId) => {
    const { Recruitercandidates } = get();
    const updatedCandidates = Recruitercandidates.map(candidate => {
      if (candidate.seekerId === seekerId) {
        return {
          ...candidate,
          phase: decision ? 'Offer' : 'Assessment'
        };
      }
      return candidate;
    });
    set({ Recruitercandidates: updatedCandidates });
  },

  RecruiterCandidatesFetchCandidates: async () => {
    const {
      RecruiterCandidatesPage,
      RecruiterCandidatesHasMore,
      RecruiterCandidatesIsLoading,
    } = get();
    
    if (!RecruiterCandidatesHasMore || RecruiterCandidatesIsLoading) return;
    set({ RecruiterCandidatesIsLoading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const startIndex = (RecruiterCandidatesPage - 1) * 5;
      const endIndex = startIndex + 5;
      
      const newRows = candidatesMockData.slice(startIndex, endIndex);

      set((state: CombinedState) => ({
        Recruitercandidates: [
          ...state.Recruitercandidates,
          ...newRows.map(candidate => ({
            ...candidate,
            dateApplied: formatDistanceToNow(new Date(candidate.dateApplied), { addSuffix: true }),
          }))
        ],
        RecruiterCandidatesHasMore: endIndex < candidatesMockData.length,
        RecruiterCandidatesIsLoading: false,
        RecruiterCandidatesPage: state.RecruiterCandidatesPage + 1
      }));
    } catch (err) {
      set({ RecruiterCandidatesIsLoading: false });
    }
  },

  RecruiterCandidatesSetPositionTitles: async () => {
    const positionTitles = Array.from(new Set(mockDetailedJobs.map(job => job.title)));
    set({
      RecruiterCandidatesPositionTitles: [
        ...positionTitles.map(title => ({ 
          value: title, 
          label: title 
        }))
      ]
    });
  }
});