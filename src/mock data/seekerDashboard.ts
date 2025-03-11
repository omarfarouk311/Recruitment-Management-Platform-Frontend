import { JobsAppliedFor } from "../types/seekerDashboard";

export const mockJobsAppliedFor: JobsAppliedFor[] = Array(50)
    .fill({})
    .map((_, index) => ({
        jobTitle: "Software Engineer II",
        jobId: index + 1 != 5? index + 1: null as unknown as number,
        companyName: "Microsoft",
        companyId: index + 1 != 5? index + 1: null as unknown as number,
        country: "Egypt",
        city: "Cairo",
        dateApplied: "2025-03-05T15:27:06.997Z",
        lastStatusUpdate: "2025-03-05T15:27:06.997Z",
        phase: "CV Screening",
        status: "Pending"
    }));

export const mockJobsAppliedForCompanies: string[] = Array(20)
    .fill('')
    .map((_, index) => `Microsoft ${index + 1}`);