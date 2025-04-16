export interface Invitations {
  department: string;
  recruiter: string;
  dateSent: string;
  deadline: string;
  status: string;
}

export interface InvitationsFilters {
  status: string;
  sortBy: string;
}

export const InvitationsStatusFilterOptions = [
  { value: "", label: "Any" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Accepted" },
  { value: "2", label: "Rejected" },
];

export const InvitationsSortByFilterOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "Date Sent (Ascending)" },
  { value: "-1", label: "Date Sent (Descending)" },
  { value: "2", label: "Deadline (Ascending)" },
  { value: "-2", label: "Deadline (Descending)" },
];

export interface Logs {
  performedBy: string;
  performedAt: string;
  actionType: string;
  extraData: Object;
}

export interface LogsFilters {
  performedBy: string;
  date: string;
  action: string;
}

