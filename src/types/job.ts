import { Review } from "./review";

export interface Job {
    id: number;
    title: string;
    country: string;
    city: string;
    datePosted: string;
    companyData: {
        id: number
        name: string;
        rating: number;
        image: string;
    },
    closed?: boolean;
}

export interface JobDetails {
    id: number;
    title: string;
    description: string;
    country: string;
    city: string;
    datePosted: string;
    applicantsCount: number;
    matchingSkillsCount: number;
    jobSkillsCount: number;
    remote: boolean;
    applied: boolean;
    reported: boolean;
    closed: boolean;
    companyData: {
        id: number;
        image: string;
        name: string;
        rating: number;
        size: number;
        foundedIn: number;
        type: string;
        industriesCount: number;
        industries: string[];
    };
    companyReviews: Review[];
    similarJobs: Job[];
}

export interface ForYouTabFilters {
    datePosted: string;
    companyRating: string;
    industry: string;
    country: string;
    city: string;
    remote: boolean;
}

export interface CompanyJobListFilters {
    jobs: {
        id: number;
        jobTitle: string;
    },
    sortBy: string;
}

export interface CompanyProfileJobsFilters {
    sortByDate: string;
    industry: string;
    remote: boolean;
}