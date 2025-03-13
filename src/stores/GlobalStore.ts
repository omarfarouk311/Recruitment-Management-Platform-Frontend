import { create } from 'zustand';
import { createSelectorHooks, ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from './Seeker Home Slices/forYouTabSlice'
import { createCompaniesTabSlice } from './Seeker Home Slices/companiesTabSlice'
import { createHomePageSlice } from './Seeker Home Slices/homePageSlice'
import { createSeekerJobsAppliedForSlice } from './Seeker Dashboard Slices/jobAppliedForSlice'
import { CombinedState } from './storeTypes';
import { createSeekerDashboardPageSlice } from './Seeker Dashboard Slices/dashboardPageSlice';
import { createJobDetailsDialogSlice } from './Dialogs/jobDetailsDialogSlice';
import { createSeekerAssessmentsSlice } from './Seeker Dashboard Slices/assessmentSlice';
import {createSeekerInterviewsSlice} from './Seeker Dashboard Slices/interviewSlice';

const useGlobalStore = create<CombinedState>((...a) => ({
    ...createForYouTabSlice(...a),
    ...createCompaniesTabSlice(...a),
    ...createHomePageSlice(...a),
    ...createSeekerJobsAppliedForSlice(...a),
    ...createSeekerDashboardPageSlice(...a),
    ...createJobDetailsDialogSlice(...a),
    ...createSeekerAssessmentsSlice(...a),
    ...createSeekerInterviewsSlice(...a),
}));

export default createSelectorHooks(useGlobalStore) as typeof useGlobalStore & ZustandHookSelectors<CombinedState>;