export interface Invitations {
  department: string;
  recruiter: string;
  dateSent: string;
  deadline: string;
  status: string;
  recruiterId: number;
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


export interface CompanyRecruiters {
  id: number;
  name: string;
  department: string;
  assigned_candidates_cnt: number;
}

export interface RecruiterNames {
  id: string;
  name: string;
}

export interface CompanyRecruitersFilter {
  id: number | undefined;
  name: string | undefined;
  department: string | undefined;
  sorted: number | undefined;
}



export interface CompanyAssignedCandidates {
  job_seeker_id: number;
  job_seeker_name: string;
  job_title: string;
  job_id: number
  phase_name: string;
}


export interface CompanyAssignedCandidatesFilters {
  phaseType: string;
  jobTitle: string;
}