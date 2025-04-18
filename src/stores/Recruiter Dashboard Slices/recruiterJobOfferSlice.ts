import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { formatDistanceToNow } from "date-fns";
import { DashboardStatusFilterOptions } from "../../types/recruiterDashboard";

import {
    RecruiterJobOfferInfo,
    RecruiterJobOfferFilters,
} from "../../types/jobOffer";
import config from "../../../config/config";
import axios from "axios";

export interface RecruiterJobOfferSlice {
    RecruiterJobOfferCandidates: RecruiterJobOfferInfo[];
    RecruiterJobOfferPage: number;
    RecruiterJobOfferHasMore: boolean;
    RecruiterJobOfferIsLoading: boolean;
    RecruiterJobOfferFilters: RecruiterJobOfferFilters;
    RecruiterJobOfferPositionTitles: { value: string; label: string }[];

    ResetRecruiterJobOffer: () => void;
    RecruiterJobOfferSetFilters: (
        filters: Partial<RecruiterJobOfferFilters>
    ) => Promise<void>;
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
        jobTitle: "",
        sorted: "",
        status: "",
    },
    RecruiterJobOfferPositionTitles: [],

    RecruiterJobOfferSetFilters: async (newFilters) => {
        set((state: CombinedState) => ({
            RecruiterJobOfferFilters: {
                ...state.RecruiterJobOfferFilters,
                ...newFilters,
            },
            RecruiterJobOfferCandidates: [],
            RecruiterJobOfferPage: 1,
            RecruiterJobOfferHasMore: true,
        }));
        await get().RecruiterJobOfferFetchCandidates();
    },

    ResetRecruiterJobOffer() {
        set({
            RecruiterJobOfferCandidates: [],
            RecruiterJobOfferPage: 1,
            RecruiterJobOfferHasMore: true,
            RecruiterJobOfferIsLoading: false,
            RecruiterJobOfferFilters: {
                jobTitle: "",
                sorted: "",
                status: "",
            },
            RecruiterJobOfferPositionTitles: [],
        });
    },

    RecruiterJobOfferFetchCandidates: async () => {
        const {
          RecruiterJobOfferPage,
          RecruiterJobOfferHasMore,
          RecruiterJobOfferIsLoading,
          RecruiterJobOfferFilters,
        } = get();
      
        if (!RecruiterJobOfferHasMore || RecruiterJobOfferIsLoading) return;
        set({ RecruiterJobOfferIsLoading: true });
      
        try {
          const params = {
            page: RecruiterJobOfferPage,
            sorted: RecruiterJobOfferFilters.sorted || undefined,
            status: RecruiterJobOfferFilters.status || undefined, 
            jobTitle: RecruiterJobOfferFilters.jobTitle || undefined,
          };

          for (const key in params) {
            if (params[key as keyof typeof params] === undefined) {
                delete params[key as keyof typeof params];
            }
        }
      
          const res = await axios.get(`${config.API_BASE_URL}/recruiters/job-offer-sent`, { params });

          // Extract the jobOffers array from the response
          const jobOffers = res.data.jobOffers;

          set((state: CombinedState) => ({
            RecruiterJobOfferCandidates: [
              ...state.RecruiterJobOfferCandidates,
              ...jobOffers.map((item: any) => ({
                jobTitle: item.jobtitle,
                seekerName: item.candidatename,
                
                dateApplied: formatDistanceToNow(
                
                  new Date(item.datesent), 
                  { addSuffix: true }
                ),
                seekerId: item.id, 
                jobId: 1,    
                status: "PENDING"  
              })),
            ],

            
            RecruiterJobOfferHasMore: jobOffers.length > 0,
            RecruiterJobOfferIsLoading: false,
            RecruiterJobOfferPage: state.RecruiterJobOfferPage + 1,
          }));
        } catch (err) {
          console.error("Fetch error:", err); // Log errors
          set({ RecruiterJobOfferIsLoading: false });
        }
      },

    RecruiterJobOfferSetPositionTitles: async () => {
      const {
        RecruiterJobOfferFilters,
      } = get();

        //Simplified will always be false
        const params = {
            jobTitle: RecruiterJobOfferFilters.jobTitle || undefined,      
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
        RecruiterJobOfferPositionTitles: positionTitles,
      });
    },
});
