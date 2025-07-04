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

export interface assessment  {
  assessmentId: number
  jobTitle: string;
  assessmentName: string;
  assessmentTime:string
  numberOfQuestions: number;
}

export interface AssessmentFilters{  
  jobTitle: string;
}

export interface TemplateData { 
  id?: number;
  name: string;
  updatedAt?: string;
  content?: string;
}


export const InvitationsStatusFilterOptions = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Accepted" },
  { value: "2", label: "Rejected" },
];

export const InvitationsSortByFilterOptions = [
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



export interface CompanyRecruitmentProcesses {
  id: number;
  name: string;
  num_of_phases: number;
}


export interface Process {
  id: number;
  name: string;
  num_of_phases: number;
  phases?: Phase[];
}

export interface Phase {
  id: number;
  phase_num: number;
  phasename: string;
  type: number;
  deadline?: string;
  assessmentname?: string;
  assessment_time?: string;
  assessmentid?: number | null;
}
