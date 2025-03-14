import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice";
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice";
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice";
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { SeekerProfileSlice } from "./Profile Slices/profileSlices";
import { JobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";
import { JobOfferDialogSlice } from "./Dialogs/jobOfferDialogSlice";
import { SeekerJobOffersSlice } from "./Seeker Dashboard Slices/SeekerJobOffersSlice";

export type CombinedState = ForYouTabSlice & CompaniesTabSlice & HomePageSlice & SeekerJobsAppliedForSlice & DashboardPageSlice & SeekerProfileSlice & JobDetailsDialogSlice &SeekerJobOffersSlice &JobOfferDialogSlice;
