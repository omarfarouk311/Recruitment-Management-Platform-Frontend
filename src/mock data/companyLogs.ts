import { Logs } from "../types/companyDashboard";

export const mockCompanyLogs: Logs[] = Array(50)
  .fill({})
  .map((_, index) => ({
    performedBy: "Recruiter " + index,
    performedAt: new Date("2023-09-06T22:00:00").toISOString(),
    actionType: "Moved",
    extraData: { From: "CV Screening ", To: "Interview", jobSeeker: "Seeker 1", jobTitle: "African Slave"},
  }));

export const mockCompanyActions: { id: number; name: string }[] = Array(50)
  .fill({})
  .map((_, index) => ({
    id: index,
    name: "Recruiter " + index,
  }));

export const mockCompanyPerformedBy: string[] = Array(50)
  .fill({})
  .map((_, index) => "recruiter" + index);;
