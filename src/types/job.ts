import { Review } from "./review";

interface ComapnyInfo {
    image?: string;
    name: string;
    rating: number;
    overview: string;
    size: number;
    foundedIn: number;
    type: string;
    industriesCount: number;
}

export interface Job {
    company: string;
    companyRating: number;
    title: string;
    country: string;
    city: string;
    datePosted: string;
}

export interface JobDetails {
    title: string;
    country: string;
    city: string;
    datePosted: string;
    applicantsCount: number;
    matchingSkillsCount: number;
    jobSkillsCount: number;
    remote: boolean;
    companyData: ComapnyInfo;
    companyReviews: Review[];
}

export interface ForYouPageFilters {
    datePosted: string;
    companyRating: number;
    industry: string;
    country: string;
    city: string;
    remote: boolean;
}