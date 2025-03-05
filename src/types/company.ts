export interface CompanyCard {
    image: string;
    name: string;
    overview: string;
    size: number;
    rating: number;
    reviewsCount: number;
    jobsCount: number;
    locationsCount: number;
    industriesCount: number;
}

export interface CompaniesPageFilters {
    country: string;
    city: string;
    industry: string;
    size: number;
    rating: [number, number];
    type: string;
}

export interface CompanyProfile {
    image: string;
    name: string;
    overview: string;
    type: string;
    foundedIn: number;
    size: string;
    rating: number;
    locationsCount: number;
    industriesCount: number;
    jobsCount: number
}
