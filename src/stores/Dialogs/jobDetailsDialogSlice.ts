import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export interface JobDetailsDialogSlice {
    JobDetailsDialogIsOpen: boolean;
    JobDetailsDialogSelectedJobId: number | null;
    JobDetailsDialogSetIsOpen: (value: boolean) => void;
    JobDetailsDialogSetSelectedJobId: (id: number) => void;
}

export const createJobDetailsDialogSlice: StateCreator<CombinedState, [], [], JobDetailsDialogSlice> = (set) => ({
    JobDetailsDialogIsOpen: false,
    JobDetailsDialogSelectedJobId: null,
    JobDetailsDialogSetIsOpen: (value) => set({ JobDetailsDialogIsOpen: value }),
    JobDetailsDialogSetSelectedJobId: (id) => set({ JobDetailsDialogSelectedJobId: id }),
});