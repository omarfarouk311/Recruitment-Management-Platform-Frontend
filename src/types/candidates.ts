export interface Candidate {
    seekerId: number;
    seekerName: string;
    phase: string;
    recruiterId?: string;
    jobId: number;
    jobTitle: string;
    dateApplied: string;
    phaseDeadline?: string;
    candidateCountry: string;
    candidateCity: string;
    jobCity: string;
    jobCountry: string;
  }
  
  export const CandidatePhases = [
    {label:'CV Screening',value:"0"},
    {label:'Interview',value:"1"},
    {label:'Assessment',value:"2"},
    {label:'Offer',value:"3"},
  ]
  
  export interface CandidateFilters {
    candidateCountry: string;
    candidateCity: string;
    phaseType: string;
    jobTitle: string;
    sortBy: string;
  }

  // Define CandidateSortOptions
export const CandidateSortOptions = [
  { label: 'Date Applied{Ascending}', value: "1" },
  { label: 'Date Applied{Desecending}', value: "-1" },
];
