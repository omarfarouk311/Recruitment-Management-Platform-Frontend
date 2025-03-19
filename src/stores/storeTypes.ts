import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { SeekerProfileSlice } from "./Profile Slices/profileSlices";
import { JobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { JobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { SeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";

import { RecruiterCandidatesSlice } from "./Recruiter Slices/recruiterCandidatesSlice";
import { RecruiterInvitationsSlice } from "./Recruiter Dashboard Slices/RecruiterInvitationSlice";
import { recruiterDashboardPageSlice } from "./Recruiter Dashboard Slices/recruiterDashboardPageSlice";
import { RecruiterJobOfferSlice } from "./Recruiter Slices/recruiterJobOfferSlice";

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
  RecruiterCandidatesSlice&
  RecruiterInvitationsSlice &
  recruiterDashboardPageSlice&
  RecruiterJobOfferSlice;
