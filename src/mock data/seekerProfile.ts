import { Education, Experience, Skill } from '../types/profile';

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

export const mockCVs = [
  {
    id: "1",
    name: "Software Engineer Resume",
    date: "2023-08-15",
  },
  {
    id: "2",
    name: "Academic CV",
    date: "2023-05-01",
  },
];

export const mockReviews = [
  {
    id: 1,
    rating: 5,
    description:
      "This product exceeded all my expectations. The quality is outstanding and the customer service was top-notch.",
    role: "Senior Developer",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    rating: 4,
    description:
      "Works as described, though the setup process could be better documented. Overall satisfied with the purchase.",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    rating: 3,
    description:
      "Product works but the performance could be better. Customer support was helpful in resolving my issue.",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    rating: 2,
    description:
      "The product arrived damaged and the replacement process took too long. Disappointed with the experience.",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    rating: 5,
    description:
      "This has revolutionized how we work. The integration capabilities are phenomenal!",
    role: "CTO",
    createdAt: new Date().toISOString(),
  },
];
