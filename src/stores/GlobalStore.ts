import { create } from 'zustand';
import { createSelectorHooks, ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from './Seeker Home Slices/forYouTabSlice'
import { createCompaniesTabSlice } from './Seeker Home Slices/companiesTabSlice'
import { createHomePageSlice } from './Seeker Home Slices/homePageSlice'
import { CombinedState } from './storeTypes';

const useGlobalStore = create<CombinedState>((...a) => ({
    ...createForYouTabSlice(...a),
    ...createCompaniesTabSlice(...a),
    ...createHomePageSlice(...a)
}));

export default createSelectorHooks(useGlobalStore) as typeof useGlobalStore & ZustandHookSelectors<CombinedState>;