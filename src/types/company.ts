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



export interface CompanyJobsRecruiters {
    id: number
    name: string;
    department: string;
    assigned_candidates_cnt: number;
}

export interface CompanyJobsRecruitersFilters {
    recruiterName: string;
    department: string;
    assignedCandidates: string;
}


export const CompanyJobsRecruitersSortOptions = [
    { label: 'Ascending', value: "1" },
    { label: 'Desecending', value: "-1" }
]

export const DashboardStatusFilterOptions = [
    { value: "1", label: "Pending" },
    { value: "3", label: "Rejected" },
    { value: "2", label: "Accepted" },
]



