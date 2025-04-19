export interface Review {
    id: number;
    title: string;
    role: string;
    createdAt: string;
    rating: number;
    description: string;
    companyData?: { id: number, name: string }
}