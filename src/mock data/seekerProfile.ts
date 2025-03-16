import { Experience } from "../types/profile";

export const mockEducation = [
  {
    id: "1",
    degree: "Bachelor of Science in Computer Science",
    institution: "Stanford University",
    location: "Palo Alto, CA",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    gpa: "3.8",
  },
  {
    id: "2",
    degree: "High School Diploma",
    institution: "Brooklyn Technical High School",
    location: "New York, NY",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    gpa: "4.0",
  },
];

export const mockExperience: Experience[] = Array(5)
  .fill({})
  .map((_, i) => ({
    id: i,
    position: "Software Engineering Intern",
    companyName: "Google",
    country: "USA",
    city: "New York",
    startDate: "2022-01",
    endDate: "2023-01",
    description: "Worked on Google Search algorithms team",
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
