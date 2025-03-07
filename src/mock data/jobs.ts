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
            id: index + 1,
            name: `Microsoft ${index + 1}`,
            rating: 4.5,
            image: "https://www.microsoft.com/favicon.ico"
        }
    }));

export const mockDetailedJobs: JobDetails[] = Array(20)
    .fill({})
    .map((_, index) => ({
        title: "Software Engineer II",
        country: "Egypt",
        city: "Cairo",
        datePosted: "2025-03-05T15:27:06.997Z",
        applicantsCount: 3,
        matchingSkillsCount: 7,
        jobSkillsCount: 10,
        remote: true,
        companyData: {
            name: `Microsoft ${index + 1}`,
            size: 18000,
            foundedIn: 1980,
            overview: "Are you ready to shape the digital future of the cloud? Join the Microsoft Azure Network Manager team and be at the forefront of innovation in the world of cloud technology. As a Software Engineer II on this team, you'll have the unique opportunity to architect, build, and deliver a seamless, reliable, and high-performance cloud infrastructure.",
            rating: 4.5,
            type: 'Public',
            industriesCount: 5,
            image: "https://www.microsoft.com/favicon.ico"
        },
        companyReviews: [
            {
                role: "Current software engineer",
                createdAt: "Dec 2, 2024",
                rating: 4,
                description:
                    "Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits  such as childcare support, commuter allowances, and employee discounts.",
            },
            {
                role: "Former team lead",
                createdAt: "Nov 15, 2024",
                rating: 4.5,
                description: "Excellent growth opportunities and supportive management...",
            },
        ],
    }));