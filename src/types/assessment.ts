export interface AssessmentData {
  id?: number;
  name: string;
  questions: Question[];
  time: number;
  jobTitle?: string;
}

export interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswers: number[];
}