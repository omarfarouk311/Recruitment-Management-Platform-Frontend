import { Candidate } from "../types/candidates";
import axios from 'axios';


// const api = axios.create({baseURL: 'http://localhost:3000/recruiter/dashboard'});
// api.get('/candidates',)

export const candidatesMockData :Candidate[] =  Array(20)
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

