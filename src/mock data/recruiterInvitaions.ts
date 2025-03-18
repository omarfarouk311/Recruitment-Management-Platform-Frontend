// import { Invitations } from "../types/recruiterDashboard";

export const mockInvitations =  Array(50)
    .fill({})
    .map((_, index) => ({
        department: "Technical",
        companyName: `Microsoft ${index + 1}`,
        companyId: index + 1,
        dateReceived: "2025-3-01",
        deadline: new Date().toISOString(),
        status: index % 2 === 0 ? "Pending" : "Rejected",
    }));

// export const mockInvitationsCompanies: string[] = Array(20)
//     .fill('')
//     .map((_, index) => `Microsoft ${index + 1}`);