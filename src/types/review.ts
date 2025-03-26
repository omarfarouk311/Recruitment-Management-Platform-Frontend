export interface Review {
    id: number;
    role: string;
    createdAt: string;
    rating: number;
    description: string;
    companyData?: { id: number, name: string }
}