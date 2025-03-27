import { AssessmentData } from "../types/assessment";

export const mockAssessmentData: AssessmentData[] = Array(5).fill(0).map((_, i) => ({
    id: i,
    name: `Assessment ${i + 1}`,
    time: 1,
    jobTitle: "Software Engineer",
    questions: Array(5).fill(0).map((_, j) => ({
        id: j,
        text: `Question ${j + 1}asdfjlk;llll;l;l;`,
        answers: Array(4).fill(0).map((_, k) => `Answer ${k + 1}`),
        correctAnswers: [0, 3],
        
    })),
}));
