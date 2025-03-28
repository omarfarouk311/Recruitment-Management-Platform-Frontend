import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { SeekerProfileSlice } from "./Profile Slices/seekerProfileSlice";
import { JobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { JobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { SeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";

import { RecruiterCandidatesSlice } from "./Recruiter Dashboard Slices/recruiterCandidatesSlice";
import { RecruiterInvitationsSlice } from "./Recruiter Dashboard Slices/RecruiterInvitationSlice";
import { recruiterDashboardPageSlice } from "./Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import { RecruiterJobOfferSlice } from "./Recruiter Dashboard Slices/recruiterJobOfferSlice";
import { RecruiterInterviewsSlice } from "./Recruiter Dashboard Slices/RecruiterInterviewSlice";
import { userSlice } from "./User Slices/userSlice";
import { SharedEntitiesSlice } from "./Shared Entities Slices/sharedEntities";
import { Assessment } from "./Assessment/assessment";

export type CombinedState =
  ForYouTabSlice &
  CompaniesTabSlice &
  HomePageSlice &
  SeekerJobsAppliedForSlice &
  DashboardPageSlice &
  SeekerProfileSlice &
  JobDetailsDialogSlice &
  SeekerJobOffersSlice &
  JobOfferDialogSlice &
  RecruiterCandidatesSlice &
  RecruiterInvitationsSlice &
  recruiterDashboardPageSlice &
  RecruiterJobOfferSlice &
  RecruiterInterviewsSlice &
  userSlice &
  SharedEntitiesSlice &
  Assessment;
