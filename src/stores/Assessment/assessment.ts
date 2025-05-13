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
    assessmentData: AssessmentData | null;
    assessmentIsLoading: boolean;
    assessmentSubmitionIsLoading: boolean;
    fetchAssessmentData: (id?: number, jobId?: number) => Promise<void>;
    assessmentModifyQuestions: (
        newQuestions: (questions: Question[]) => Question[]
    ) => void;
    assessmentSubmitAnswers: () => Promise<void>;
    assessmentSaveData: () => Promise<void>;
    assessmentUpdateData: (key: string, value: string | number) => void;
    clearAssessmentData: () => void;
}

export const createAssessmentSlice: StateCreator<
    CombinedState,
    [],
    [],
    Assessment
> = (set, get) => ({
    assessmentIsLoading: false,
    assessmentData: {
        name: "",
        time: 1,
        questions: [],
        jobTitle: "",
    },
    assessmentSubmitionIsLoading: false,
    assessmentModifyQuestions: (newQuestions) => {
        set((state) => ({
            assessmentData: {
                ...state.assessmentData!,
                questions: newQuestions(state.assessmentData!.questions),
            },
        }));
    },

    fetchAssessmentData: async (id, jobId) => {
        set({ assessmentIsLoading: true });
        if (!id && get().userRole === UserRole.COMPANY) {
            set({
                assessmentData: {
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
                            assessmentData: null,
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
                        assessmentData: {
                            id: id,
                            name: res.data.assessment.assessmentInfo.name,
                            time: res.data.assessment.assessmentInfo
                                .assessmentTime,
                            jobTitle:
                                res.data.assessment.assessmentInfo.jobTitle,
                            numberOfQuestions:
                                res.data.assessment.assessmentInfo
                                    .numberOfQuestions,
                            questions: res.data.assessment.questions.sort((a: any, b:any) => (a.questionNum<b.questionNum)),
                        },
                        assessmentIsLoading: false,
                    });
                }
            } catch (err) {
                set({ assessmentData: null, assessmentIsLoading: false });
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
                            assessmentData: null,
                            assessmentIsLoading: false,
                        });
                        showErrorToast("Assessment not found");
                        const navigate = useNavigate();
                        navigate("/seeker/dashboard");
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
                            assessmentData: null,
                            assessmentIsLoading: false,
                        });
                        showErrorToast("Assessment not found");
                        return;
                    }
                    set({
                        assessmentData: {
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
                set({ assessmentData: null, assessmentIsLoading: false });
                showErrorToast("Error fetching assessment data");
            }
        }
    },

    assessmentSubmitAnswers: async () => {
        try {
            set({ assessmentSubmitionIsLoading: true });
            const { assessmentData: selectedAssessment } = get();
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
            throw err;
        }
    },

    assessmentSaveData: async () => {
        try {
            let res
            const { assessmentData: selectedAssessment } = get();
            if (!selectedAssessment) return;
            set({ assessmentSubmitionIsLoading: true });
            if(!selectedAssessment.id) {
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
                                questionNum: question.questionNum,
                            })),
                        }
                    )
                } catch (err) {
                    if (axios.isAxiosError(err) && err.response?.status === 401) {
                        const success = await authRefreshToken();
                        if(success)
                            await (get().assessmentSaveData());
                        else {
                            showErrorToast("Error saving assessment");
                            throw err;
                        }
                    }
                    else {
                        throw err;
                    }
                }
            } else {
                try {
                    await axios.put(`${config.API_BASE_URL}/assessments/${selectedAssessment.id}`, {
                        name:selectedAssessment.name,
                        assessmentTime:selectedAssessment.time,
                        jobTitle:selectedAssessment.jobTitle,
                        metaData:selectedAssessment.questions.map(value => ({
                            questions:value.question,
                            answers:value.answers,
                            correctAnswers:value.correctAnswers,
                            questionNum:value.questionNum
                        }))
                    })
                } catch (err) {
                    if (axios.isAxiosError(err) && err.response?.status === 401) {
                        let success = await authRefreshToken();
                        if(success)
                            await (get().assessmentSaveData());
                        else {
                            showErrorToast("Error saving assessment");
                            throw err;
                        }
                    }
                    else if(axios.isAxiosError(err) && err.response?.status === 400) {
                        err.response.data.validationErrors.map((value:string) => {
                            showErrorToast(value);
                        });
                        throw err;
                    }
                }
            }
        } catch (err) {
            throw err;
        } finally {
            set({ assessmentIsLoading: true });
        }
    },

    assessmentUpdateData: (key, value) => {
        set((state) => ({
            assessmentData: {
                ...state.assessmentData!,
                [key]: value,
            },
        }));
    },

    clearAssessmentData: () => {
        set({
            assessmentIsLoading: false,
            assessmentData: {
                name: "",
                time: 1,
                questions: [],
                jobTitle: "",
            },
        })
    }
});
