export interface Invitations {
    department: string;
    companyName: string;
    companyId: number
    dateReceived: string;
    deadline: string;
    status: string
}



// export interface DashboardFilters {
//     status: string;
//     sortBy: string;
// }

export interface DashboardFilters {
    status: string;
    sortByDateReceived: string; // Sort by Date Received (Ascending/Descending)
    sortByDeadline: string; // Sort by Deadline (Ascending/Descending)
}

export const DashboardStatusFilterOptions = [
    { value: "", label: "Pending" },
    { value: "0", label: "Rejected" },
    { value: "1", label: "Accepted" },
]

export const DashboardSortByFilterOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "Date (Ascending)" },
    { value: "-1", label: "Date (Descending)" },
    { value: "2", label: "Deadline (Ascending)" },
    { value: "-2", label: "Deadline (Descending)" },
]