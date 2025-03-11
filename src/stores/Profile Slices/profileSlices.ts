import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import type { Experience, Education, CV, Skill, Review, UserProfile, UserCredentials } from '../../types/profile.ts';

export interface SeekerProfileSlice {
  seekerProfile: UserProfile;
  seekerCredentials: UserCredentials;
  seekerProfileExperience: Experience[];
  seekerProfileEducation: Education[];
  seekerProfileCvs: CV[];
  seekerProfileSkills: Skill[];
  seekerProfileReviews: Review[];
  seekerProfileLoading: boolean;
  seekerProfileError: string | null;
  seekerProfileSetProfile: (profile: UserProfile) => void;
  seekerSetCredentials: (credentials: UserCredentials) => void;
  seekerProfileAddExperience: (experience: Experience) => void;
  seekerProfileUpdateExperience: (experience: Experience) => void;
  seekerProfileRemoveExperience: (id: string) => void;
  seekerProfileAddEducation: (education: Education) => void;
  seekerProfileUpdateEducation: (education: Education) => void;
  seekerProfileRemoveEducation: (id: string) => void;
  seekerProfileAddCV: (cv: CV) => void;
  seekerProfileUpdateCV: (cv: CV) => void;
  seekerProfileRemoveCV: (id: string) => void;
  seekerProfileAddSkill: (skill: Skill) => void;
  seekerProfileRemoveSkill: (id: string) => void;
  seekerProfileAddReview: (review: Review) => void;
  seekerProfileRemoveReview: (id: string) => void;
  seekerProfileSetLoading: (loading: boolean) => void;
  seekerProfileSetError: (error: string | null) => void;
}

export const createSeekerProfileSlice: StateCreator<CombinedState, [], [], SeekerProfileSlice> = (set, get) => ({
  
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
      seekerProfileExperience: [{
        id: '1',
        company: 'Microsoft',
        position: 'Software Engineer - Senior',
        location: 'California, US',
        startDate: 'Aug 2020',
        endDate: 'Oct 2022',
        description: 'I worked on Microsoft Azure development.',
        logo: 'https://example.com/microsoft-logo.png'
      }],
      seekerProfileEducation: [{
        id: '1',
        institution: 'Ain Shams University',
        degree: "Bachelor's Degree, Computer Science",
        location: 'California, US',
        startDate: 'Aug 2020',
        endDate: 'Oct 2022',
        gpa: '3.69'
      }],
      seekerProfileCvs: [
        { id: '1', name: 'User 1.pdf', date: 'Dec 2, 2024' },
        { id: '2', name: 'User 1.pdf', date: 'Dec 2, 2024' }
      ],
      seekerProfileSkills: [
        { id: '1', name: 'Databases', category: 'Technical' },
        { id: '2', name: 'Databases', category: 'Technical' },
        { id: '3', name: 'Databases', category: 'Technical' },
        { id: '4', name: 'Databases', category: 'Technical' },
        { id: '5', name: 'Databases', category: 'Technical' }
      ],
      seekerProfileReviews: [{
        id: '1',
        title: 'Current software engineer',
        rating: 4,
        date: 'Dec 2, 2024',
        content: 'Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits such as childcare support, commuter allowances, and employee discounts.'
      }],
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
      seekerProfileSetLoading: (loading) => set({ seekerProfileLoading: loading }),
      seekerProfileSetError: (error) => set({ seekerProfileError: error })
    
});

export default createSeekerProfileSlice;