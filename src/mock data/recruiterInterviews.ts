export const mockInterviews = Array(50)
    .fill({})
    .map((_, index) => ({
        userName: `User ${index + 1}`,
        userId: index + 1,
        jobTitle: "Software Engineer II",
        jobId: index + 1,
        date: "2025-03-18 21:00:00",
        location: "United States",
        candidateLocation: "United States",
    }));