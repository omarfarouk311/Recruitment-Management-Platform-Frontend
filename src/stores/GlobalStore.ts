import { create } from "zustand";
import {
    createSelectorHooks,
    ZustandHookSelectors,
} from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { createCompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { createHomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { createSeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { CombinedState } from "./storeTypes";
import { createSeekerDashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { createJobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { createJobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { createSeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";
import createSeekerProfileSlice from "./Profile Slices/profileSlices";


const useGlobalStore = create<CombinedState>((...a) => ({
    ...createForYouTabSlice(...a),
    ...createCompaniesTabSlice(...a),
    ...createHomePageSlice(...a),
    ...createSeekerJobsAppliedForSlice(...a),
    ...createSeekerDashboardPageSlice(...a),
    ...createSeekerProfileSlice(...a),
    ...createJobDetailsDialogSlice(...a),
    ...createJobOfferDialogSlice(...a),
    ...createSeekerJobOffersSlice(...a),
}));

export default createSelectorHooks(useGlobalStore) as typeof useGlobalStore &
    ZustandHookSelectors<CombinedState>;
