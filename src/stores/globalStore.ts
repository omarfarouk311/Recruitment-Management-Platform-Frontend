import { create } from "zustand";
import { createSelectorHooks, ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { createCompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { createHomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { createSeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { CombinedState } from "./storeTypes";
import { createSeekerDashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { createSeekerProfileSlice } from "./Profile Slices/seekerProfileSlice";
import { createJobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { persist } from "zustand/middleware";
import { createJobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { createSeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";
import { createInvitationsSlice } from "./Recruiter Dashboard Slices/RecruiterInvitationSlice";
import { createRecruiterDashboardPageSlice } from "./Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import { createRecruiterCandidatesSlice } from "./Recruiter Slices/recruiterCandidatesSlice";
import { createRecruiterJobOfferSlice } from "./Recruiter Slices/recruiterJobOfferSlice";
import { createInterviewsSlice } from "./Recruiter Dashboard Slices/RecruiterInterviewSlice";
import { createUserSlice, userSlice } from "./User Slices/userSlice";
import { createSharedEntitiesSlice } from "./Shared Entities Slices/sharedEntities";

const useGlobalStore = create<CombinedState, [["zustand/persist", Partial<userSlice>]]>(
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
            ...createRecruiterCandidatesSlice(...a),
            ...createRecruiterJobOfferSlice(...a),
            ...createInterviewsSlice(...a),
            ...createUserSlice(...a),
            ...createSharedEntitiesSlice(...a)
        }),
        {
            name: "user-store",
            partialize: (state) => ({
                userId: state.userId,
                userName: state.userName,
                userRole: state.userRole,
                userImage: state.userImage,
            }),
        }
    )
);

export default createSelectorHooks(useGlobalStore) as typeof useGlobalStore & ZustandHookSelectors<CombinedState>;
