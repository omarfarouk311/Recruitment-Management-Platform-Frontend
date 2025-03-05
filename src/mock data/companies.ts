import { CompanyCard } from '../types/company';

export const mockCompanies: CompanyCard[] = Array(20)
    .fill({})
    .map((_, index) => ({
        image: "https://www.microsoft.com/favicon.ico",
        name: `Microsoft ${index + 1}`,
        overview: "At Microsoft, our mission is to empower every person and every organization on the planet to achieve more. When you join Microsoft, you're not just taking on a job, you're embracing a calling. A calling where your individual contributions amplify into a collective force championing global progress and innovation.",
        rating: 4.5,
        size: 2300,
        reviewsCount: 1200,
        jobsCount: 1600,
        locationsCount: 4,
        industriesCount: 2,
    }));