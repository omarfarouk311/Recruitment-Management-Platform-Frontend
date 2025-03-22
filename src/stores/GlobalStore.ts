import { create } from 'zustand';
import { createSelectorHooks, ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from './Seeker Home Slices/forYouTabSlice'
import { createCompaniesTabSlice } from './Seeker Home Slices/companiesTabSlice'
import { createHomePageSlice } from './Seeker Home Slices/homePageSlice'
import { createSeekerJobsAppliedForSlice } from './Seeker Dashboard Slices/jobAppliedForSlice'
import { CombinedState } from './storeTypes';
import { createSeekerDashboardPageSlice } from './Seeker Dashboard Slices/dashboardPageSlice';
import { createSeekerProfileSlice } from './Profile Slices/profileSlices';
import { createJobDetailsDialogSlice } from './Dialogs/jobDetailsDialogSlice';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/profile';
import { createJobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { createSeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";
import { createInvitationsSlice } from "./Recruiter Dashboard Slices/RecruiterInvitationSlice";
import { createRecruiterDashboardPageSlice } from "./Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import { createInterviewsSlice } from "./Recruiter Dashboard Slices/RecruiterInterviewSlice";
import { createRecruiterProfileSlice } from "./Profile Slices/recruiterProfileSlices";
const useGlobalStore = create<CombinedState, [["zustand/persist", { seekerProfile: UserProfile }]]>(
    persist(
        (...a) => ({
            ...createForYouTabSlice(...a),
            ...createCompaniesTabSlice(...a),
            ...createHomePageSlice(...a),
            ...createSeekerJobsAppliedForSlice(...a),
            ...createSeekerDashboardPageSlice(...a),
            ...createSeekerProfileSlice(...a),
            ...createJobDetailsDialogSlice(...a),
            ...createJobOfferDialogSlice(...a),
            ...createSeekerJobOffersSlice(...a),
            ...createInvitationsSlice(...a),
            ...createRecruiterDashboardPageSlice(...a),
            ...createInterviewsSlice(...a),
            ...createRecruiterProfileSlice(...a),

        }),
        {
            name: "user-store",
            partialize: (state) => ({ seekerProfile: state.seekerProfile })
        },
    )
);

export default createSelectorHooks(useGlobalStore) as typeof useGlobalStore & ZustandHookSelectors<CombinedState>;
