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
export interface RecruiterJobOfferInfo {

    jobTitle:string;
    seekerName:string;
    dateApplied:string;
    seekerId:number;
    jobId:number;
    status:string;
}

export interface RecruiterJobOfferFilters{
    jobTitle: string;
    sortBy: string;
}

export const JobOfferSortByFilterOptions = [
    { value: "1", label: "Date Recieved (Ascending)" },
    { value: "-1", label: "Date Recieved (Descending)" },
]