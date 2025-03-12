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
    assessmentId: number
}


export interface JobsAppliedForFilters extends DashboardFilters {
    remote?: boolean;
}

export interface DashboardFilters{  
    country: string;
    city: string;
    status: string;
    phase: string;
    sortBy: string;
    company: string  
}

export const DashboardStatusFilterOptions = [
    { value: "", label: "Pending" },
    { value: "0", label: "Rejected" },
    { value: "1", label: "Accepted" },
]

export const DashboardSortByFilterOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "Date Applied (Ascending)" },
    { value: "-1", label: "Date Applied (Descending)" },
    { value: "2", label: "Last Status Update (Ascending)" },
    { value: "-2", label: "Last Status Update (Descending)" },
]