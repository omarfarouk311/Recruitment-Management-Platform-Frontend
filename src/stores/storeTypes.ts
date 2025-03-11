import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice"
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice"
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice"
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedForSlice";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";
import { JobDetailsDialogSlice } from "./Dialogs/jobDetailsDialogSlice";

export type CombinedState = ForYouTabSlice & CompaniesTabSlice & HomePageSlice & SeekerJobsAppliedForSlice & DashboardPageSlice & JobDetailsDialogSlice;