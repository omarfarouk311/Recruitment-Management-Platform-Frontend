import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import type { Experience, Education, CV, Skill, Review, UserProfile,UserCredentials } from '../../types/profile.ts';
import { mockEducation, mockExperience, mockCVs,mockReviews } from '../../mock data/seekerProfile.ts';

export interface SeekerProfileSlice {
  seekerProfile: UserProfile;
  seekerCredentials: UserCredentials;
  seekerProfileExperience: Experience[];
  seekerProfileEducation: Education[];
  seekerProfileCvs: CV[];
  seekerProfileSkills: Skill[];
  seekerProfileReviews: Review[];
  seekerProfileError: string | null;
  seekerProfileSetProfile: (profile: UserProfile) => void;
  seekerSetCredentials: (credentials: UserCredentials) => void;
  seekerProfileAddExperience: (experience: Experience) => void;
  seekerProfileUpdateExperience: (experience: Experience) => void;
  seekerProfileRemoveExperience: (id: string) => void;
  seekerProfileAddEducation: (education: Education) => void;
  seekerProfileUpdateEducation: (education: Education) => void;
  seekerProfileRemoveEducation: (id: string) => void;
  seekerProfileEducationFetchData: () => Promise<void>;
  seekerProfileExperienceFetchData: () => Promise<void>;
  seekerProfileCvFetchData: () => Promise<void>;
  seekerProfileReviewsFetchData: () => Promise<void>;
  seekerProfileAddCV: (cv: CV) => void;
  seekerProfileUpdateCV: (cv: CV) => void;
  seekerProfileRemoveCV: (id: string) => void;
  seekerProfileAddSkill: (skill: Skill) => void;
  seekerProfileRemoveSkill: (id: string) => void;
  seekerProfileAddReview: (review: Review) => void;
  seekerProfileRemoveReview: (id: string) => void;
  seekerProfileSetError: (error: string | null) => void;
}

export const createSeekerProfileSlice: StateCreator<CombinedState, [], [], SeekerProfileSlice> = (set, get) => ({


    seekerProfileCvFetchData: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          set({ seekerProfileCvs: mockCVs });
          resolve();
        }, 1000);
      });
    },

    seekerProfileExperienceFetchData: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          set({ seekerProfileExperience: mockExperience });
          resolve();
        }, 1000);
      });
    },
    seekerProfileEducationFetchData: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          set({ seekerProfileEducation: mockEducation });
          resolve();
        }, 1000);
      });
    },
    seekerProfileReviewsFetchData: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          set({ seekerProfileReviews: mockReviews });
          resolve();
        }, 1000);
      });
    },
  
      seekerProfile: {
        id: '1',
        name: 'User 1',
        country: 'US',
        city: 'California',
        avatar: ''
      },
    seekerCredentials: {
        id: '1',
        email: 'boody@gmail.com',
        password: '12345678'
      },
      seekerProfileExperience: [],
      seekerProfileEducation: [],
      seekerProfileCvs: [],
      seekerProfileSkills: [
        { id: '1', name: 'Databases', category: 'Technical' },
        { id: '2', name: 'Databases', category: 'Technical' },
        { id: '3', name: 'Databases', category: 'Technical' },
        { id: '4', name: 'Databases', category: 'Technical' },
        { id: '5', name: 'Databases', category: 'Technical' }
      ],
      seekerProfileReviews: [],
      seekerProfileLoading: false,
      seekerProfileError: null,
      seekerProfileSetProfile: (profile) => set({ seekerProfile: profile }),
      seekerSetCredentials: (credentials: UserCredentials) => set((state) => ({
        seekerCredentials: credentials, // Replace the entire credentials object
      })),
      seekerProfileAddExperience: (experience) => set((state) => ({ 
        seekerProfileExperience: [...state.seekerProfileExperience, experience] 
      })),
      seekerProfileUpdateExperience: (experience) => set((state) => ({
        seekerProfileExperience: state.seekerProfileExperience.map((exp) => 
          exp.id === experience.id ? experience : exp
        )
      })),
      seekerProfileRemoveExperience: (id) => set((state) => ({
        seekerProfileExperience: state.seekerProfileExperience.filter((exp) => exp.id !== id)
      })),
      seekerProfileAddEducation: (education) => set((state) => ({
        seekerProfileEducation: [...state.seekerProfileEducation, education]
      })),
      seekerProfileUpdateEducation: (education) => set((state) => ({
        seekerProfileEducation: state.seekerProfileEducation.map((edu) => 
          edu.id === education.id ? education : edu
        )
      })),
      seekerProfileRemoveEducation: (id) => set((state) => ({
        seekerProfileEducation: state.seekerProfileEducation.filter((edu) => edu.id !== id)
      })),
      seekerProfileAddCV: (cv) => set((state) => ({
        seekerProfileCvs: [...state.seekerProfileCvs, cv]
      })),
      seekerProfileUpdateCV: (cv) => set((state) => ({
        seekerProfileCvs: state.seekerProfileCvs.map((c) => 
          c.id === cv.id ? cv : c
        )
      })),
      seekerProfileRemoveCV: (id) => set((state) => ({
        seekerProfileCvs: state.seekerProfileCvs.filter((cv) => cv.id !== id)
      })),
      seekerProfileAddSkill: (skill) => set((state) => ({
        seekerProfileSkills: [...state.seekerProfileSkills, skill]
      })),
      seekerProfileRemoveSkill: (id) => set((state) => ({
        seekerProfileSkills: state.seekerProfileSkills.filter((skill) => skill.id !== id)
      })),
      seekerProfileAddReview: (review) => set((state) => ({
        seekerProfileReviews: [...state.seekerProfileReviews, review]
      })),
      seekerProfileRemoveReview: (id) => set((state) => ({
        seekerProfileReviews: state.seekerProfileReviews.filter((review) => review.id !== id)
      })),
      seekerProfileSetError: (error) => set({ seekerProfileError: error })
    
});

export default createSeekerProfileSlice;