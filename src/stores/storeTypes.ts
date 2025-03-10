import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice"
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice"
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice"
import { SeekerJobsAppliedForSlice } from "./Seeker Dashboard Slices/jobAppliedFor";
import { DashboardPageSlice } from "./Seeker Dashboard Slices/dashboardPageSlice";

export type CombinedState = ForYouTabSlice & CompaniesTabSlice & HomePageSlice & SeekerJobsAppliedForSlice & DashboardPageSlice;