import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { mockDetailedJobs } from "../../mock data/seekerForYou";
import { mockJobOffersInfo } from "../../mock data/jobOffers";
import { formatDistanceToNow } from "date-fns";
import { RecruiterJobOfferInfo , RecruiterJobOfferFilters } from "../../types/jobOffer";

export interface RecruiterJobOfferSlice {
  RecruiterJobOfferCandidates: RecruiterJobOfferInfo[];
  RecruiterJobOfferPage: number;
  RecruiterJobOfferHasMore: boolean;
  RecruiterJobOfferIsLoading: boolean;
  RecruiterJobOfferFilters: RecruiterJobOfferFilters;
  RecruiterJobOfferPositionTitles: {value: string, label: string}[];
  
  RecruiterJobOfferSetFilters: (filters: Partial<RecruiterJobOfferFilters>) => Promise<void>;
  RecruiterJobOfferFetchCandidates: () => Promise<void>;
  RecruiterJobOfferSetPositionTitles: () => Promise<void>;
}



export const createRecruiterJobOfferSlice: StateCreator<
  CombinedState,
  [],
  [],
  RecruiterJobOfferSlice
> = (set, get) => ({
  RecruiterJobOfferCandidates: [],
  RecruiterJobOfferPage: 1,
  RecruiterJobOfferHasMore: true,
  RecruiterJobOfferIsLoading: false,
  RecruiterJobOfferFilters: {
    jobTitle: '',
    sortBy: 'date_applied'
  },
  RecruiterJobOfferPositionTitles: [],

  RecruiterJobOfferSetFilters: async (newFilters) => {
    set((state: CombinedState) => ({
      RecruiterJobOfferFilters: { 
        ...state.RecruiterJobOfferFilters, 
        ...newFilters 
      },
      RecruiterJobOfferCandidates: [],
      RecruiterJobOfferPage: 1,
      RecruiterJobOfferHasMore: true
    }));
    await get().RecruiterJobOfferFetchCandidates();
  },

  RecruiterJobOfferFetchCandidates: async () => {
    const {
      RecruiterJobOfferPage,
      RecruiterJobOfferHasMore,
      RecruiterJobOfferIsLoading,
    } = get();
    
    if (!RecruiterJobOfferHasMore || RecruiterJobOfferIsLoading) return;
    set({ RecruiterJobOfferIsLoading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const startIndex = (RecruiterJobOfferPage - 1) * 5;
      const endIndex = startIndex + 5;
      
      const newRows = mockJobOffersInfo.slice(startIndex, endIndex);

      set((state: CombinedState) => ({
        RecruiterJobOfferCandidates: [
          ...state.RecruiterJobOfferCandidates,
          ...newRows.map(RecruiterJobOfferInfo => ({
            ...RecruiterJobOfferInfo,
            dateApplied: formatDistanceToNow(new Date(RecruiterJobOfferInfo.dateApplied), { addSuffix: true }),
          }))
        ],
        RecruiterJobOfferHasMore: endIndex < mockJobOffersInfo.length,
        RecruiterJobOfferIsLoading: false,
        RecruiterJobOfferPage: state.RecruiterJobOfferPage + 1
      }));
    } catch (err) {
      set({ RecruiterJobOfferIsLoading: false });
    }
  },

  RecruiterJobOfferSetPositionTitles: async () => {
    const positionTitles = Array.from(new Set(mockDetailedJobs.map(job => job.title)));
    set({
      RecruiterJobOfferPositionTitles: [
        ...positionTitles.map(title => ({ 
          value: title, 
          label: title 
        }))
      ]
    });
  }
});