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

export interface UserProfile {
  id: string;
  avatar: string;
  name: string;
  country: string;
  city: string;
  phone: string;
  gender: string;
  birthDate: string;
  role: string;
}

export interface UserCredentials {
  id: string
  email: string;
  password: string;
}