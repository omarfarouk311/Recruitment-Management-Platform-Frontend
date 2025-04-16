import { AssessmentData, Question } from "../../types/assessment";
import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { mockAssessmentData } from "../../mock data/assessment";

export interface Assessment {
    selectedAssessment: AssessmentData | null;
    assessmentIsLoading: boolean;
    setSelectedAssessment: (id?: number) => Promise<void>;
    assessmentModifyQuestions: (newQuestions: (questions: Question[]) => Question[]) => void;
    assessmentSubmitAnswers: () => void;
    assessmentSaveData: () => void;
    assessmentUpdateData: (key: string, value: string | number) => void;
}

export const createAssessmentSlice: StateCreator<
    CombinedState,
    [],
    [],
    Assessment
> = (set, get) => ({
    assessmentIsLoading: false,
    selectedAssessment: {
        name: "",
        time: 1,
        questions: [],
        jobTitle: "",
    },

    assessmentModifyQuestions: (newQuestions) => {
        set((state) => ({
            selectedAssessment: {
                ...state.selectedAssessment!,
                questions: newQuestions(state.selectedAssessment!.questions),
            },
        }));
    },

    setSelectedAssessment: async (id) => {
        if (!id) {
            set({
                selectedAssessment: {
                    name: "",
                    time: 0,
                    questions: [{
                        id: 1,
                        text: "",
                        answers: [],
                        correctAnswers: [],
                    }],
                },
            });
        } else {
            set({ assessmentIsLoading: true });
            const assessment = await new Promise<AssessmentData>((resolve) => {
                setTimeout(() => {
                    const assessment = mockAssessmentData.find(
                        (a) => a.id === id
                    );
                    resolve(assessment!);
                }, 2000);
            });
            set({ selectedAssessment: assessment, assessmentIsLoading: false });
        }
    },

    assessmentSubmitAnswers: () => {
        // Submit answers
    },

    assessmentSaveData: () => {
        // Save assessment data
    },

    assessmentUpdateData: (key, value) => {
        set((state) => ({
            selectedAssessment: {
                ...state.selectedAssessment!,
                [key]: value,
            },
        }));
    }
});
