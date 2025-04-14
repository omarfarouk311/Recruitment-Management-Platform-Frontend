export interface Invitations {
    department: string;
    name: string;
    companyId: number
    dateReceived: string;
    deadline: string;
    status: string
}


export interface Interviews {
    userName: string;
    userId: number;
    jobTitle: string;
    jobId: number;
    date: string;
    location: string;
    candidateLocation: string;
    isRemote: boolean;
}

export interface DashboardInterviewsFilters {
    jobTitle: string;
    sortByDate: string; // Sort by Date Received (Ascending/Descending)
}

export interface updateInterviewDate {
    jobId: number;
    date: string;
}

// for the invitations
export interface DashboardFilters {
    status: string;
    sortByDateReceived: string; // Sort by Date Received (Ascending/Descending)
    sortByDeadline: string; // Sort by Deadline (Ascending/Descending)
}

export const DashboardStatusFilterOptions = [
    { value: "-1", label: "Pending" },
    { value: "0", label: "Rejected" },
    { value: "1", label: "Accepted" },
]

export const DashboardSortByFilterOptions = [
    { value: "1", label: "Date (Ascending)" },
    { value: "-1", label: "Date (Descending)" },
    { value: "2", label: "Deadline (Ascending)" },
    { value: "-2", label: "Deadline (Descending)" },
]

export const DashboardJobTitleFilterOptions = [
    { value: "", label: "All" },
    { value: "software-engineer", label: "Software Engineer" },
    { value: "product-manager", label: "Product Manager" },
];