export const baseJobs = Array(20)
    .fill({})
    .map((_, index) => ({
        company: `Microsoft ${index + 1}`,
        rating: 4.5,
        position: "Software Engineer II",
        location: "Cairo, Egypt",
        datePosted: "",
        industry: ""
    }));

export const baseDetailedJobs = Array(20)
    .fill({})
    .map((_, index) => ({
        company: `Microsoft ${index + 1}`,
        rating: 4.5,
        position: "Software Engineer II",
        location: "Cairo, Egypt",
        description:
            "Are you ready to shape the digital future of the cloud? Join the Microsoft Azure Network Manager team and be at the forefront of innovation in the world of cloud technology. As a Software Engineer II on this team, you'll have the unique opportunity to architect, build, and deliver a seamless, reliable, and high-performance cloud infrastructure.",
        companyDetails: {
            size: "18000",
            founded: "1975",
            type: "Public",
            industry: "Information Technology",
        },
        reviews: [
            {
                title: "Current software engineer",
                date: "Dec 2, 2024",
                rating: 4,
                content:
                    "Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits  such as childcare support, commuter allowances, and employee discounts.",
            },
            {
                title: "Former team lead",
                date: "Nov 15, 2024",
                rating: 4.5,
                content: "Excellent growth opportunities and supportive management...",
            },
        ],
    }));
    