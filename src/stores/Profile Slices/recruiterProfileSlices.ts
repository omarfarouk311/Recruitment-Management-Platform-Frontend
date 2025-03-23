import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { RecruiterProfileInfo as UserProfile, UserCredentials } from '../../types/profile.ts';

export interface RecruiterProfileSlice {

    recruiterProfile: UserProfile;
    recruiterProfileSetProfile: (profile: UserProfile) => void;

    recruiterCredentials: UserCredentials;
    recruiterSetCredentials: (credentials: UserCredentials) => void;
}

export const createRecruiterProfileSlice: StateCreator<CombinedState, [], [], RecruiterProfileSlice> = (set, get) => ({
    recruiterProfile: {
        id: '1',
        name: 'User 1',
        country: '',
        city: '',
        phone: '1234567890',
        gender: 'Male',
        birthDate: new Date().toISOString(),
        avatar: '',
        role: ''
    },
    recruiterCredentials: {
        id: '1',
        email: 'boody@gmail.com',
        password: '12345678'
    },
    recruiterProfileSetProfile: (profile) => set({ recruiterProfile: profile }),

    recruiterSetCredentials: (credentials: UserCredentials) => set((state) => ({
        recruiterCredentials: credentials, // Replace the entire credentials object
    })),
 

});

export default createRecruiterProfileSlice;