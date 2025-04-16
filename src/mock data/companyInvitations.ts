import { Invitations } from "../types/companyDashboard";

export const mockCompanyInvitations: Invitations[] = Array(50)
    .fill({})
    .map((_, index) => ({
        department: "Department " + index,
        recruiter: "Recruiter " + index,
        dateSent: new Date(2021, 8, 1).toISOString(),
        deadline: new Date("2023-09-06T22:00:00").toISOString(),
        status: "Rejected",
    }));