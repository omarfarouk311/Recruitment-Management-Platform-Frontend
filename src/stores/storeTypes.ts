import { ForYouTabSlice } from "./Seeker Home Slices/forYouTabSlice"
import { CompaniesTabSlice } from "./Seeker Home Slices/companiesTabSlice"
import { HomePageSlice } from "./Seeker Home Slices/homePageSlice"

export type CombinedState = ForYouTabSlice & CompaniesTabSlice & HomePageSlice;