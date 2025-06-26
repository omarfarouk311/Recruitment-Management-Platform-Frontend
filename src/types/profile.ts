export interface Experience {
  id?: number;
  companyName: string;
  position: string;
  country: string;
  city: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id?: number;
  institution: string;
  fieldOfStudy: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Skill {
  id?: number;
  name: string;
}

export interface CV {
  id?: number;
  name: string;
  createdAt: string;
}

export interface SeekerProfileInfo {
  image?: string | File;
  name: string;
  country: string;
  city: string;
  phone: string;
  gender: "male" | "female" | "";
  birthDate: string;
}

export interface CompanyProfileInfo {
  id: number;
  image?: string | File;
  name: string;
  overview: string;
  type: string;
  foundedIn: number;
  size: number;
  rating: number;
  reviewsCount: number;
  locationsCount: number;
  industriesCount: number;
  jobsCount: number;
  locations: { country: string, city: string }[];
  industries: { id: number, name: string }[];
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RecruiterProfileInfo {
  image?: string | File;
  name: string;
}

export interface RecruiterCompanyInfo {
  company: {
    id: number | null,
    name: string,
    image: string,
  },
  department: string,
  assignedCandidatesCnt: number
}