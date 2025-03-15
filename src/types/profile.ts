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
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface CV {
  id: string;
  name: string;
  date: string;
}

export interface Skill {
  id?: string;
  name: string;
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