import { CV, SeekerProfileInfo, UserCredentials } from '../types/profile';
import { Education, Experience, Skill } from '../types/profile';
import { Review } from '../types/review';

export const mockSeekerProfileInfo: SeekerProfileInfo = {
  name: 'User 1',
  country: 'US',
  city: 'California',
  phone: '+201125831866',
  gender: 'male',
  birthdate: '2000-01-01',
  image: '',
};

export const mockSeekerCredentials: UserCredentials = {
  email: 'test@gmail.com',
  password: ''
}

export const mockExperience: Experience[] = Array(5)
  .fill({})
  .map((_, i) => ({
    id: i,
    position: `Software Engineering Intern ${i + 1}`,
    companyName: "Google",
    country: "USA",
    city: "New York",
    startDate: "2022-01",
    endDate: "2023-01",
    description: "Worked on Google Search algorithms team",
  }));

export const mockEducation: Education[] = Array(5)
  .fill({})
  .map((_, i) => ({
    id: i,
    degree: `Bachelor of Science in Computer Science ${i + 1}`,
    institution: "Stanford University",
    country: "USA",
    city: "New York",
    startDate: "2022-01",
    endDate: "2023-01",
    grade: "3.8",
  }));

export const mockSkills: Skill[] = Array(10)
  .fill({})
  .map((_, i) => ({
    id: i,
    name: `Node.js ${i + 1}`
  }));

export const mockCVs: CV[] = Array(5)
  .fill({})
  .map((_, i) => ({
    id: i,
    name: `Omar.pdf ${i + 1}`,
    createdAt: "2025-03-05T15:27:06.997Z"
  }));

export const mockReviews: Review[] = Array(20)
  .fill({})
  .map((_, i) => ({
    id: i,
    rating: (i % 5) + 1,
    description:
      "Great Company Great Company Great Company Great Company Great Company Great Company Great Company Great Company Great Company Great Company Great Company.",
    role: `Senior Developer ${i + 1}`,
    createdAt: new Date().toISOString(),
    companyData: {
      id: i,
      name: `Microsoft ${i + 1}`
    }
  }));
