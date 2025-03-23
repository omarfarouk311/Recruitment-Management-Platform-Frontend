import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";

export interface userSlice {
  userId: number | null;
  userName: string | null;
  userRole: "seeker" | "recruiter" | "company" | null;
  userImage: string | null;
  userSetId: (id: number) => void;
  userSetName: (name: string) => void;
  userSetRole: (role: "seeker" | "recruiter" | "company") => void;
  userSetImage: (image: string) => void;
}

export const createUserSlice: StateCreator<CombinedState, [], [], userSlice> = (set, get) => ({
  userId: null,
  userName: null,
  userRole: null,
  userImage: null,

  userSetId: (id) => {
    set({ userId: id });
  },

  userSetName: (name) => {
    set({ userName: name });
  },

  userSetRole: (role) => {
    set({ userRole: role });
  },

  userSetImage: (image) => {
    set({ userImage: image });
  }
});