export interface JobOfferDetailsType {
    templateName: string;
    templateId: number;
    placeholders: object | string[];
    description: string;
}

export interface JobOfferTemplateListType {
    templateName: string;
    templateId: number;
}

export interface JobOfferOverviewType {
    jobId: number;
    companyName: string;
    jobTitle: string;
    companyId: number;
    dateRecieved: string;
    status: string;
    city: string;
    country: string;
}

export const JobOfferSortByFilterOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "Date Recieved (Ascending)" },
    { value: "-1", label: "Date Recieved (Descending)" },
]