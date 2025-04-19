import { StateCreator } from 'zustand';
import { mockIndustries } from '../../mock data/seekerForYou';
import { CombinedState } from '../storeTypes';
import axios from "axios";
import config from "../../../config/config.ts";

export interface SharedEntitiesSlice {
    sharedEntitiesIndustryOptions: { value: string, label: string }[];
    sharedEntitiesSetIndustryOptions: () => Promise<void>;
}

export const createSharedEntitiesSlice: StateCreator<CombinedState, [], [], SharedEntitiesSlice> = (set, get) => ({
    sharedEntitiesIndustryOptions: [],

    sharedEntitiesSetIndustryOptions: async () => {
        // mock API call

        try {
            
      
            let res = await axios.get(`${config.API_BASE_URL}/industries/`);
            
            set((state) => ({
                sharedEntitiesIndustryOptions: [
                ...state.sharedEntitiesIndustryOptions,
                ...res.data.map((obj: any) => ({
                    value: obj.id.toString(),
                    label: obj.name,
                })),
              ],
             
            }));
      
          }catch (err) {
            console.error(err);
          }
      
    }

});