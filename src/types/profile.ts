export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string;
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
  id: string;
  name: string;
  category: string;
}

export interface Review {
  id: string;
  title: string;
  rating: number;
  date: string;
  content: string;
}

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  avatar?: string;
}