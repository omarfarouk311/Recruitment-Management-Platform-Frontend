export interface AssessmentData {
  id?: number;
  name: string;
  questions: Question[];
  time: number;
  jobTitle?: string;
  numberOfQuestions?: number;
  jobId?: number;
}

export interface Question {
  id: number;
  question: string;
  answers: string[];
  questionNum: number;
  correctAnswers: number[];
}