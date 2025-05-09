import { AssessmentData, Question } from "../../types/assessment";
import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { UserRole } from "../User Slices/userSlice";
import axios from "axios";
import config from "../../../config/config";
import { showErrorToast } from "../../util/errorHandler";
import { authRefreshToken } from "../../util/authUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface Assessment {
    selectedAssessment: AssessmentData | null;
    assessmentIsLoading: boolean;
    assessmentSubmitionIsLoading: boolean;
    setSelectedAssessment: (id?: number, jobId?: number) => Promise<void>;
    assessmentModifyQuestions: (
        newQuestions: (questions: Question[]) => Question[]
    ) => void;
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
    assessmentSubmitionIsLoading: false,
    assessmentModifyQuestions: (newQuestions) => {
        set((state) => ({
            selectedAssessment: {
                ...state.selectedAssessment!,
                questions: newQuestions(state.selectedAssessment!.questions),
            },
        }));
    },

    setSelectedAssessment: async (id, jobId) => {
        set({ assessmentIsLoading: true });
        if (!id && get().userRole === UserRole.COMPANY) {
            set({
                selectedAssessment: {
                    name: "",
                    time: 0,
                    questions: [
                        {
                            id: 1,
                            question: "",
                            answers: [],
                            correctAnswers: [],
                            questionNum: 1,
                        },
                    ],
                },
            });
        } else if (id && get().userRole === UserRole.COMPANY) {
            try {
                let res;
                try {
                    res = await axios.get(
                        `${config.API_BASE_URL}/assessments/${id}`
                    );
                } catch (err) {
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 404
                    ) {
                        set({
                            selectedAssessment: null,
                            assessmentIsLoading: false,
                        });
                        showErrorToast("Assessment not found");
                        return;
                    }
                    if (
                        axios.isAxiosError(err) &&
                        err.response?.status === 401
                    ) {
                        await authRefreshToken();
                        res = await axios.get(
                            `${config.API_BASE_URL}/assessments/${id}`
                        );
                    }
                }
                if (res) {
                    set({
                        selectedAssessment: {
                            id: id,
                            name: res.data.assessment.assessmentInfo.name,
                            time: res.data.assessment.assessmentInfo
                                .assessmentTime,
                            jobTitle:
                                res.data.assessment.assessmentInfo.jobTitle,
                            numberOfQuestions:
                                res.data.assessment.assessmentInfo
                                    .numberOfQuestions,
                            questions: res.data.assessment.questions.sort((a: any, b:any) => (a.questionNum-b.questionNum)),
                        },
                        assessmentIsLoading: false,
                    });
                }
            } catch (err) {
                set({ selectedAssessment: null, assessmentIsLoading: false });
                showErrorToast("Error fetching assessment data");
            }
        } else if (id && jobId && get().userRole === UserRole.SEEKER) {
            let res;
            try{
                try {
                    res = await axios.get(
                        `${config.API_BASE_URL}/assessments/${id}/job/${jobId}`
                    );
                } catch (err) {
                    if (axios.isAxiosError(err) && err.response?.status === 404) {
                        set({
                            selectedAssessment: null,
                            assessmentIsLoading: false,
                        });
                        showErrorToast("Assessment not found");
                        return;
                    }
                    if (axios.isAxiosError(err) && err.response?.status === 401) {
                        await authRefreshToken();
                        res = await axios.get(
                            `${config.API_BASE_URL}/assessments/${id}/job/${jobId}`
                        );
                    }
                }
                if (res) {
                    if (res.data.assessmentDetails.questions.length === 0) {
                        set({
                            selectedAssessment: null,
                            assessmentIsLoading: false,
                        });
                        showErrorToast("Assessment not found");
                        return;
                    }
                    [].sort()
                    set({
                        selectedAssessment: {
                            id: id,
                            jobId: jobId,
                            name: res.data.assessmentDetails.name,
                            time: res.data.assessmentDetails.assessment_time,
                            numberOfQuestions:
                                res.data.assessmentDetails.num_of_questions,
                            questions: res.data.assessmentDetails.questions.sort((a: any, b:any) => (a.questionNum-b.questionNum)).map(
                                (question: Question) => ({
                                    ...question,
                                    correctAnswers: [],
                                })
                            ),
                        },
                        assessmentIsLoading: false,
                    });
                }
            } catch (err) {
                set({ selectedAssessment: null, assessmentIsLoading: false });
                showErrorToast("Error fetching assessment data");
            }
        }
    },

    assessmentSubmitAnswers: async () => {
        try {
            set({ assessmentSubmitionIsLoading: true });
            const { selectedAssessment } = get();
            if (!selectedAssessment) return;
            const answers = selectedAssessment.questions.map((question) => ({
                questionId: question.id,
                answers: question.correctAnswers,
            }));
            let res;
            try {
                res = await axios.post(
                    `${config.API_BASE_URL}/assessments/${selectedAssessment.id}/job/${selectedAssessment.jobId}`,
                    { metaData: answers }
                );
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    await authRefreshToken();
                    res = await axios.post(
                        `${config.API_BASE_URL}/assessments/${selectedAssessment.id}/job/${selectedAssessment.jobId}`,
                        { metaData: answers }
                    );
                } else {
                    throw err;
                }
            }
            
            set({ assessmentSubmitionIsLoading: false });
            toast.success("Assessment submitted successfully");
        } catch (err) {
            set({ assessmentSubmitionIsLoading: false });
            showErrorToast("Error submitting answers");
        }
    },

    assessmentSaveData: async () => {
        try {
            let res
            const { selectedAssessment } = get();
            if (!selectedAssessment) return;
            try {
                res = await axios.post(
                    `${config.API_BASE_URL}/assessments`,
                    {
                        name: selectedAssessment.name,
                        assessmentTime: selectedAssessment.time,
                        jobTitle: selectedAssessment.jobTitle,
                        metaData: selectedAssessment.questions.map((question) => ({
                            questions: question.question,
                            answers: question.answers,
                            correctAnswers: question.correctAnswers,
                        })),
                    }
                )
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    await authRefreshToken();
                    res = await axios.post(
                        `${config.API_BASE_URL}/assessments`,
                        {
                            name: selectedAssessment.name,
                            assessmentTime: selectedAssessment.time,
                            jobTitle: selectedAssessment.jobTitle,
                            metaData: selectedAssessment.questions.map((question) => ({
                                questions: question.question,
                                answers: question.answers,
                                correctAnswers: question.correctAnswers,
                            })),
                        }
                    )
                }
                else {
                    throw err;
                }
            }
        } catch (err) {
            set({ assessmentSubmitionIsLoading: false });
            showErrorToast("Error saving assessment");
            throw err;
        }
    },

    assessmentUpdateData: (key, value) => {
        set((state) => ({
            selectedAssessment: {
                ...state.selectedAssessment!,
                [key]: value,
            },
        }));
    },
});
