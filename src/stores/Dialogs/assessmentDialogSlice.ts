import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";

export interface AssessmentDialogSlice {
    assessmentDialogIsOpen: boolean;
    selectedAssessmentId: number | null;
    setAssessmentDialogIsOpen: (isOpen: boolean) => void;
    setSelectedAssessmentId: (id: number | null) => void;
}

export const createAssessmentDialogSlice: StateCreator<
    CombinedState,
    [],
    [],
    AssessmentDialogSlice
> = (set) => ({
    assessmentDialogIsOpen: false,
    selectedAssessmentId: null,
    setAssessmentDialogIsOpen: (isOpen) => set({ assessmentDialogIsOpen: isOpen }),
    setSelectedAssessmentId: (id) => set({ selectedAssessmentId: id }),
});