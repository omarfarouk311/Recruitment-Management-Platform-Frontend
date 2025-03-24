export interface Experience {
  id?: number;
  companyName: string;
  position: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  country: string;
  city: string;
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
  image?: string;
  name: string;
  country: string;
  city: string;
  phone: string;
  gender: "male" | "female" | "";
  birthdate: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}