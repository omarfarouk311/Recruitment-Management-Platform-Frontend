import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';

export interface JobDetailsDialogSlice {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export const createJobDetailsDialogSlice: StateCreator<CombinedState, [], [], JobDetailsDialogSlice> = (set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
});