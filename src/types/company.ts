export interface CompanyCard {
    id: number
    image?: string;
    name: string;
    overview: string;
    size: number;
    rating: number;
    reviewsCount: number;
    jobsCount: number;
    locationsCount: number;
    industriesCount: number;
    locations: { country: string, city: string }[];
    industries: string[];
}

export interface CompaniesTabFilters {
    country: string;
    city: string;
    industry: string;
    size: string;
    rating: string;
    type: string;
}