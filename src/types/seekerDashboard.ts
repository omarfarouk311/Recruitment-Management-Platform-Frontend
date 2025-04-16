export interface JobsAppliedFor {
    jobTitle: string;
    jobId: number;
    companyName: string;
    companyId?: number
    country: string;
    city: string;
    dateApplied: string;
    lastStatusUpdate: string;
    phase: string;
    status: string;
}


export interface assessment  {
    assessmentId: number
    jobTitle: string;
    jobId: number;
    companyName: string;
    companyId?: number
    country: string;
    city: string;
    dateAdded: string;
    deadline: string;
    status: string;
    assessmentTime:string
}

export interface interview  {
    jobTitle: string;
    jobId: number;
    companyName: string;
    companyId?: number
    country: string;
    city: string;
    date: string;
    recruiter: string;
    status: string;
}

export interface JobsAppliedForFilters extends DashboardFilters {
    remote?: boolean;
}

export interface DashboardFilters{  
    country: string;
    city: string;
    status: string;
    sortBy: string;
    company: string  
}


export const DashboardStatusFilterOptions = [
    { value: "", label: "Pending" },
    { value: "3", label: "Rejected" },
    { value: "2", label: "Accepted" },
]

export const DashboardSortByFilterOptions = [
    { value: "1", label: "Date Applied (Ascending)" },
    { value: "-1", label: "Date Applied (Descending)" },
    { value: "2", label: "Last Status Update (Ascending)" },
    { value: "-2", label: "Last Status Update (Descending)" },
]