import { Job, JobDetails } from "../types/job";

export const mockJobs: Job[] = Array(20)
    .fill({})
    .map((_, index) => ({
        id: index,
        title: "Software Engineer II",
        country: "Egypt",
        city: "Cairo",
        datePosted: new Date().toISOString(),
        companyData: {
            id: index,
            name: `Microsoft ${index + 1}`,
            rating: 4.5,
            image: "https://www.microsoft.com/favicon.ico"
        }
    }));

export const mockDetailedJobs: JobDetails[] = Array(20)
    .fill({})
    .map((_, index) => ({
        id: index,
        title: "Software Engineer II",
        description: "Are you ready to shape the digital future of the cloud? Join the Microsoft Azure Network Manager team and be at the forefront of innovation in the world of cloud technology. As a Software Engineer II on this team, you'll have the unique opportunity to architect, build, and deliver a seamless, reliable, and high-performance cloud infrastructure.",
        country: "Egypt",
        city: "Cairo",
        datePosted: "2025-03-05T15:27:06.997Z",
        applicantsCount: 3,
        matchingSkillsCount: 7,
        jobSkillsCount: 10,
        remote: true,
        applied: false,
        reported: false,
        companyData: {
            id: index,
            name: `Microsoft ${index + 1}`,
            size: 1100,
            foundedIn: 1980,
            rating: 4.5,
            type: 'Public',
            industriesCount: 5,
            image: "https://www.microsoft.com/favicon.ico",
            industries: []
        },
        companyReviews: [
            {
                id: 1,
                role: "Current software engineer",
                title: "Software Engineer II",
                createdAt: "Dec 2, 2024",
                companyData: {
                    id: 1,
                    name: `Microsoft ${index + 1}`,
                },
                rating: 4,
                description:
                    "Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits  such as childcare support, commuter allowances, and employee discounts.",
            },
            {
                id: 2,
                role: "Former team lead",
                title: "Software Engineer II",
                companyData: {
                    id: 2,
                    name: `Microsoft ${index + 1}`,
                },
                createdAt: "Nov 15, 2024",
                rating: 4.5,
                description: "Excellent growth opportunities and supportive management...",
            },
        ],
        similarJobs: Array(3)
            .fill({})
            .map((_, index) => ({
                id: index,
                title: "Software Engineer III",
                country: "USA",
                city: "New York",
                datePosted: "2025-03-05T15:27:06.997Z",
                companyData: {
                    id: index,
                    name: `Microsoft ${index + 1}`,
                    rating: 4.5,
                    image: "https://www.microsoft.com/favicon.ico"
                }
            }))
    }));

export const mockIndustries: { id: number, label: string }[] = Array(10)
    .fill({})
    .map((_, index) => ({
        id: index, label: `Technology ${index}`
    }));