import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { Experience, Education, CV, Skill, UserProfile, UserCredentials } from '../../types/profile.ts';
import { Review } from '../../types/review.ts';
import { mockEducation, mockExperience, mockCVs, mockReviews, mockSkills } from '../../mock data/seekerProfile.ts';
let cnt = 100;

export interface SeekerProfileSlice {
    seekerProfileReviews: Review[];

    seekerProfile: UserProfile;
    seekerProfileSetProfile: (profile: UserProfile) => void;

    seekerCredentials: UserCredentials;
    seekerSetCredentials: (credentials: UserCredentials) => void;

    seekerProfileExperience: Experience[];
    seekerProfileFetchExperience: () => Promise<void>;
    seekerProfileAddExperience: (experience: Experience) => Promise<void>;
    seekerProfileUpdateExperience: (experience: Experience) => Promise<void>;
    seekerProfileRemoveExperience: (id: number) => Promise<void>;

    seekerProfileEducation: Education[];
    seekerProfileFetchEducation: () => Promise<void>;
    seekerProfileAddEducation: (education: Education) => Promise<void>;
    seekerProfileUpdateEducation: (education: Education) => Promise<void>;
    seekerProfileRemoveEducation: (id: number) => Promise<void>;

    seekerProfileSkills: Skill[];
    seekerProfileFetchSkills: () => Promise<void>;
    seekerProfileAddSkill: (skill: Skill) => Promise<void>;
    seekerProfileRemoveSkill: (id: number) => Promise<void>;

    seekerProfileCvs: CV[];
    seekerProfileCvFetchData: () => Promise<void>;
    seekerProfileAddCV: (cv: CV) => void;
    seekerProfileUpdateCV: (cv: CV) => void;
    seekerProfileRemoveCV: (id: string) => void;

    seekerProfileReviewsFetchData: () => Promise<void>;
    seekerProfileAddReview: (review: Review) => void;
    seekerProfileRemoveReview: (id: string) => void;
}

export const createSeekerProfileSlice: StateCreator<CombinedState, [], [], SeekerProfileSlice> = (set, get) => ({
    seekerProfile: {
        id: '1',
        name: 'User 1',
        country: 'US',
        city: 'California',
        phone: '1234567890',
        gender: 'Male',
        birthDate: new Date().toISOString(),
        avatar: '',
        role: ''
    },
    seekerCredentials: {
        id: '1',
        email: 'boody@gmail.com',
        password: '12345678'
    },
    seekerProfileExperience: [],
    seekerProfileEducation: [],
    seekerProfileSkills: [],
    seekerProfileCvs: [],
    seekerProfileReviews: [],
    seekerProfileLoading: false,
    seekerProfileError: null,

    seekerProfileCvFetchData: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set({ seekerProfileCvs: mockCVs });
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

    seekerProfileSetProfile: (profile) => set({ seekerProfile: profile }),
    seekerSetCredentials: (credentials: UserCredentials) => set((state) => ({
        seekerCredentials: credentials, // Replace the entire credentials object
    })),

    seekerProfileFetchExperience: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set({ seekerProfileExperience: [...mockExperience] });
                resolve();
            }, 1000);
        });
    },

    seekerProfileAddExperience: async (experience) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileExperience: [{ ...experience, id: cnt++ }, ...state.seekerProfileExperience]
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileUpdateExperience: async (experience) => {
        console.log(experience);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileExperience: state.seekerProfileExperience.map((exp) =>
                        exp.id === experience.id ? { ...exp, ...experience } : { ...exp }
                    )
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileRemoveExperience: async (id) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileExperience: state.seekerProfileExperience.filter((exp) => exp.id !== id)
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileFetchEducation: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set({ seekerProfileEducation: [...mockEducation] });
                resolve();
            }, 1000);
        });
    },

    seekerProfileAddEducation: async (education) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileEducation: [{ ...education, id: cnt++ }, ...state.seekerProfileEducation]
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileUpdateEducation: async (education) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileEducation: state.seekerProfileEducation.map((edu) =>
                        edu.id === education.id ? { ...edu, ...education } : { ...edu }
                    )
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileRemoveEducation: async (id) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileEducation: state.seekerProfileEducation.filter((edu) => edu.id !== id)
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileFetchSkills: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set({ seekerProfileSkills: [...mockSkills] });
                resolve();
            }, 1000);
        });
    },

    seekerProfileAddSkill: async (skill) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileSkills: [{ ...skill, id: cnt++ }, ...state.seekerProfileSkills,]
                }))
                resolve();
            }, 1000);
        });
    },

    seekerProfileRemoveSkill: async (id) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileSkills: state.seekerProfileSkills.filter((skill) => skill.id !== id)
                }))
                resolve();
            }, 1000);
        });
    },

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


    seekerProfileAddReview: (review) => set((state) => ({
        seekerProfileReviews: [...state.seekerProfileReviews, review]
    })),

    seekerProfileRemoveReview: (id) => set((state) => ({
        seekerProfileReviews: state.seekerProfileReviews.filter((review) => review.id.toString() !== id)
    })),

});

export default createSeekerProfileSlice;