import { create } from "zustand";
import { createSelectorHooks, ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { createCompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { createHomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { CombinedState } from "./storeTypes";
import { createSeekerDashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { createSeekerProfileSlice } from "./Profile Slices/seekerProfileSlice";
import { createJobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { persist } from "zustand/middleware";
import { createJobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { createSeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";
import { createInvitationsSlice } from "./Recruiter Dashboard Slices/RecruiterInvitationSlice";
import { createRecruiterDashboardPageSlice } from "./Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import { createRecruiterCandidatesSlice } from "./Recruiter Dashboard Slices/recruiterCandidatesSlice";
import { createRecruiterJobOfferSlice } from "./Recruiter Dashboard Slices/recruiterJobOfferSlice";
import { createCompanyProfileSlice } from "./Profile Slices/companyProfileSlice";

import { createInterviewsSlice } from "./Recruiter Dashboard Slices/RecruiterInterviewSlice";
import { createUserSlice, userSlice } from "./User Slices/userSlice";
import { createSharedEntitiesSlice } from "./Shared Entities Slices/sharedEntities";
import { createAssessmentSlice } from "./Assessment/assessment";
import { createCompanyDashboardPageSlice } from "./Company Dashboard Slice/dashboardPageSlice";
import { createCompanyInvitationsSlice } from "./Company Dashboard Slice/invitationsSlice";
import { createCompanyLogsSlice } from "./Company Dashboard Slice/logsSlice";
import { createRecruiterProfileSlice } from "./Profile Slices/recruiterProfileSlices";


import { createSeekerJobsAppliedForSlice } from './Seeker Dashboard Slices/jobAppliedForSlice';
import { createSeekerAssessmentsSlice } from './Seeker Dashboard Slices/assessmentSlice';
import { createSeekerInterviewsSlice } from './Seeker Dashboard Slices/interviewSlice';
import { createAssessmentDialogSlice } from './Dialogs/assessmentDialogSlice';


import { createCompanyCandidatesSlice } from "./Company Dashboard Slice/CompanyJobsCandidatesSlice";

import { createcompanyJobsSlice } from "./Company Dashboard Slice/CompanyJobListsSlice";
import { createCompanyJobsRecruitersSlice } from "./Company Dashboard Slice/CompanyJobsRecruitersSlice";
import {createCompanyAssessmentsSlice} from "./Company Dashboard Slice/CompanyAssessmentSlice";

import { createCompanyRecruitersSlice } from "./Company Dashboard Slice/CompanyRecruitersSlice";

import { createCompanyAssignedCandidatesSlice } from "./Company Dashboard Slice/CompanyAssignedCandidatesSlice";

import { createCompanyRecruitmentProcessesSlice } from "./Company Dashboard Slice/CompanyRecruitmentProcessesSlice";

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
            ...createSharedEntitiesSlice(...a),
            ...createAssessmentSlice(...a),
            ...createCompanyDashboardPageSlice(...a),
            ...createCompanyInvitationsSlice(...a),
            ...createCompanyLogsSlice(...a),
            ...createRecruiterProfileSlice(...a),
            ...createCompanyProfileSlice(...a),
            ...createSeekerJobsAppliedForSlice(...a),
            ...createSeekerAssessmentsSlice(...a),
            ...createSeekerInterviewsSlice(...a),
            ...createAssessmentDialogSlice(...a), 

            ...createCompanyCandidatesSlice(...a),
            ...createcompanyJobsSlice(...a),

            ...createCompanyJobsRecruitersSlice(...a),
            ...createCompanyRecruitersSlice(...a),
            ...createCompanyAssignedCandidatesSlice(...a),
            ...createCompanyAssessmentsSlice(...a),
            ...createCompanyRecruitmentProcessesSlice(...a),
            
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
