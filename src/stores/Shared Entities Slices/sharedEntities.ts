import { StateCreator } from 'zustand';
import { mockIndustries } from '../../mock data/seekerForYou';
import { CombinedState } from '../storeTypes';

export interface SharedEntitiesSlice {
    sharedEntitiesIndustryOptions: { value: string, label: string }[];
    sharedEntitiesSetIndustryOptions: () => Promise<void>;
}

export const createSharedEntitiesSlice: StateCreator<CombinedState, [], [], SharedEntitiesSlice> = (set, get) => ({
    sharedEntitiesIndustryOptions: [],

    sharedEntitiesSetIndustryOptions: async () => {
        // mock API call
        await new Promise<void>((resolve) => setTimeout(() => {
            const newIndustries = [...mockIndustries];
            set({
                sharedEntitiesIndustryOptions: newIndustries.map(({ id, label }) => ({ value: id.toString(), label }))
            });

            resolve();
        }, 500));
    }

});