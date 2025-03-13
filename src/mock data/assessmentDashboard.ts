import { assessment } from "../types/seekerDashboard";

export const mockAssessment: assessment[] = Array(50)
    .fill({})
    .map((_, index) => ({
        jobTitle: "Software Engineer II",
        jobId: index + 1 != 5? index + 1: null as unknown as number,
        companyName: "Microsoft",
        companyId: index + 1 != 5? index + 1: null as unknown as number,
        country: "Egypt",
        city: "Cairo",
        dateAdded: "2025-03-05T15:27:06.997Z",
        deadline: "2025-03-05T15:27:06.997Z",
        status: "Pending",
        assessmentId: index + 1 != 5? index + 1: null as unknown as number,
    }));

