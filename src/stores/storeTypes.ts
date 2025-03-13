import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice"
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice"
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice"
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { JobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { SeekerAssessmentsSlice } from "./Seeker Dashboard Slices/assessmentSlice";
import { SeekerInterviewsSlice } from "./Seeker Dashboard Slices/interviewSlice";

export type CombinedState = ForYouTabSlice & CompaniesTabSlice & HomePageSlice & SeekerJobsAppliedForSlice & DashboardPageSlice & JobDetailsDialogSlice&SeekerAssessmentsSlice&SeekerInterviewsSlice;