import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";

export enum UserRole {
  SEEKER = 0,
  COMPANY = 1,
  RECRUITER = 3
}
export interface userSlice {
  userId: number | null;
  userName: string | null;
  userRole: UserRole | null;
  userImage: string | null;
  userSetId: (id: number) => void;
  userSetName: (name: string) => void;
  userSetRole: (role: UserRole) => void;
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