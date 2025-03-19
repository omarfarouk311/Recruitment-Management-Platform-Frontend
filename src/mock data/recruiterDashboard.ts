import { Candidate } from "../types/candidates";

export const candidatesMockData :Candidate[] =  Array(10)
.fill({})
.map((_, index) => ({
    seekerId: index,
    seekerName: "John Doe",
    phase: "CV Screening",
    recruiterId: "1",
    jobId: index,
    jobTitle: "Software Engineer",
    dateApplied: "2025-03-05T15:27:06.997Z",
    phaseDeadline: "2025-03-05T15:27:06.997Z",
    candidateCountry: "United States",
    candidateCity: "New York",
    jobCity: "New York",
    jobCountry: "United States",
}));

