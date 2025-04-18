import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { Experience, Education, Skill, SeekerProfileInfo, UserCredentials } from '../../types/profile.ts';
import { CV } from '../../types/profile.ts';
import { Review } from '../../types/review.ts';
import { mockEducation, mockExperience, mockCVs, mockReviews, mockSkills, mockSeekerCredentials } from '../../mock data/seekerProfile.ts';
import { mockSeekerProfileInfo } from '../../mock data/seekerProfile.ts';
import config from "../../../config/config.ts";
import { formatDistanceToNow, formatDate } from 'date-fns';
import axios from 'axios';
import { date } from 'zod';
import { toast } from 'react-toastify';
import { UserRole } from '../User Slices/userSlice.ts';
const { paginationLimit } = config;
let cnt = 100;

export interface SeekerProfileSlice {
    seekerProfileInfo: SeekerProfileInfo;
    seekerProfileUpdateInfo: (profile: SeekerProfileInfo) => Promise<void>;
    seekerProfileFetchInfo: () => Promise<void>;

    seekerCredentials: UserCredentials;
    seekerProfileFetchEmail: () => Promise<void>;
    seekerProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;

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
    seekerProfileAddSkill: (id: number) => Promise<void>;
    seekerProfileRemoveSkill: (id: number) => Promise<void>;

    seekerProfileCVs: CV[];
    seekerProfileFetchCVs: () => Promise<void>;
    seekerProfileAddCV: (cv: File, createdAt: string) => Promise<void>;
    seekerProfileRemoveCV: (id: number) => Promise<void>;
    seekerProfileGetCV: (id: number) => Promise<Blob | undefined>;

    seekerProfileReviews: Review[];
    seekerProfileReviewsHasMore: boolean;
    seekerProfileReviewsPage: number;
    seekerProfileReviewsIsLoading: boolean;
    seekerProfileFetchReviews: () => Promise<void>;
    seekerProfileUpdateReview: (review: Review) => Promise<void>;
    seekerProfileRemoveReview: (id: number) => Promise<void>;

    seekerProfileSelectedSeekerData: {seekerId?: number, jobId?: number};
    seekerProfileSkillsFormData: Skill[];
    seekerProfileFetchSkillsFormData: () => Promise<void>;
    seekerProfileClear: () => void;
}

export const createSeekerProfileSlice: StateCreator<CombinedState, [], [], SeekerProfileSlice> = (set, get) => ({
    seekerProfileInfo: {
        name: '',
        country: '',
        city: '',
        phone: '',
        gender: '',
        birthDate: '',
    },
    seekerCredentials: {
        email: '',
        password: ''
    },
    seekerProfileExperience: [],
    seekerProfileEducation: [],
    seekerProfileSkills: [],
    seekerProfileCVs: [],
    seekerProfileReviews: [],
    seekerProfileReviewsHasMore: true,
    seekerProfileReviewsPage: 1,
    seekerProfileReviewsIsLoading: false,
    seekerProfileSelectedSeekerData: {},
    seekerProfileSkillsFormData: [],

    seekerProfileFetchInfo: async () => {
        const { userId, seekerProfileSelectedSeekerData } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/profiles/${seekerProfileSelectedSeekerData.seekerId ?? userId}`);
            set({ seekerProfileInfo: { 
                ...res.data, 
                phone: res.data.phoneNumber, 
                birthDate: new Date(res.data.dateOfBirth).toISOString().split('T')[0], 
                gender: res.data.gender ? 'male' : 'female',
                image: `${config.API_BASE_URL}/seekers/profiles/${seekerProfileSelectedSeekerData.seekerId ?? userId}/image`
            }});
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if(err.response?.status === 404) {
                    set({ seekerProfileInfo: {
                        name: '',
                        country: '',
                        city: '',
                        phone: '',
                        gender: '',
                        birthDate: '',
                        image: undefined
                    }})
                }
            }
        }
    },

    seekerProfileUpdateInfo: async (profile) => {
        const { userId } = get();
        try {
            let promises = [];
            let res = axios.put(`${config.API_BASE_URL}/seekers/profiles/`, {
                name: profile.name,
                country: profile.country,
                city: profile.city,
                phoneNumber: profile.phone,
                dateOfBirth: (new Date(profile.birthDate)).toISOString(),
                gender: profile.gender === 'male'
            });
            promises.push(res);
            let imageRes;
            if(profile.image instanceof File) {
                imageRes = axios.post(`${config.API_BASE_URL}/seekers/profiles/${userId}/image`, profile.image, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                        'File-Name': profile.image.name,
                    }
                });
                promises.push(imageRes);
            }

            await Promise.all(promises);
            let tmpDate = Date.now();
            set({
                seekerProfileInfo: { ...profile, image: `${config.API_BASE_URL}/seekers/profiles/${userId}/image?t=${tmpDate}` },
                userName: profile.name,
                userImage: `${config.API_BASE_URL}/seekers/profiles/${userId}/image?t=${tmpDate}`
            });

        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                }
            }
            throw err;
        }
    },

    seekerProfileFetchEmail: async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set({ seekerCredentials: { ...mockSeekerCredentials } });
                resolve();
            }, 1000);
        });
    },

    seekerProfileUpdateCredentials: async (credentials: UserCredentials) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set(({ seekerCredentials: { email: credentials.email, password: '' } }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileFetchExperience: async () => {
        const { seekerProfileSelectedSeekerData, userId } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/experiences/${seekerProfileSelectedSeekerData.seekerId ?? userId}`);
            set({
                seekerProfileExperience: res.data.map((exp: Experience & {jobTitle: string}) => ({
                    ...exp,
                    startDate: formatDate(new Date(exp.startDate), "MMM yyyy"),
                    endDate: formatDate(new Date(exp.endDate), "MMM yyyy"),
                    position: exp.jobTitle,
                }))
            });
        } catch (err) {
            toast.error('Failed to fetch experiences. Please try again later.');
        }
    },

    seekerProfileAddExperience: async (experience) => {
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/experiences`, {
                ...experience,
                startDate: new Date(experience.startDate).toISOString(),
                endDate: experience.endDate ? new Date(experience.endDate).toISOString() : undefined,
                jobTitle: experience.position,
            });
            set((state) => ({
                seekerProfileExperience: [
                    {
                        ...experience,
                        startDate: formatDate(new Date(experience.startDate), "MMM yyyy"),
                        endDate: formatDate(new Date(experience.endDate), "MMM yyyy"),
                        id: cnt++
                    },
                    ...state.seekerProfileExperience
                ]
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                }
                else {
                    toast.error('Failed to add experience. Please try again later.');
                }
            } else {
                toast.error('Failed to add experience. Please try again later.');
            }
            throw err;
        }

    },

    seekerProfileUpdateExperience: async (experience) => {
        try {
            await axios.put(`${config.API_BASE_URL}/seekers/experiences/${experience.id}`, {
                ...experience,
                startDate: new Date(experience.startDate).toISOString(),
                endDate: experience.endDate ? new Date(experience.endDate).toISOString() : undefined,
                jobTitle: experience.position,
            });

            set((state) => ({
                seekerProfileExperience: state.seekerProfileExperience.map((exp) =>
                    exp.id === experience.id ? {
                        ...exp,
                        ...experience,
                        startDate: formatDate(new Date(experience.startDate), "MMM yyyy"),
                        endDate: formatDate(new Date(experience.endDate), "MMM yyyy"),
                    } : { ...exp }
                )
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                } else {
                    toast.error('Failed to update experience. Please try again later.');
                }
            } else {
                toast.error('Failed to update experience. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileRemoveExperience: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/experiences/${id}`);
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    set((state) => ({
                        seekerProfileExperience: state.seekerProfileExperience.filter((exp) => exp.id !== id)
                    }));
                    resolve();
                }, 1000);
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                } else {
                    toast.error('Failed to remove experience. Please try again later.');
                }
            } else {
                toast.error('Failed to remove experience. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileFetchEducation: async () => {
        const { seekerProfileSelectedSeekerData, userId } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/educations/${seekerProfileSelectedSeekerData.seekerId ?? userId}`);
            set({
                seekerProfileEducation: res.data.education.map((edu: Education & {start_date: string; end_date: string; school_name: string; field: string;}) => (
                    {
                        ...edu,
                        startDate: formatDate(new Date(edu.start_date), "MMM yyyy"),
                        endDate: formatDate(new Date(edu.end_date), "MMM yyyy"),
                        institution: edu.school_name,
                        fieldOfStudy: edu.field,
                    }
                ))
            });
        } catch (err) {
            toast.error('Failed to fetch education. Please try again later.');
        }
    },

    seekerProfileAddEducation: async (education) => {
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/educations/add`, {
                ...education,
                start_date: new Date(education.startDate).toISOString(),
                end_date: education.endDate ? new Date(education.endDate).toISOString() : undefined,
                school_name: education.institution,
                field: education.fieldOfStudy,
            })
            set((state) => ({
                seekerProfileEducation: [
                    {
                        ...education,
                        startDate: formatDate(new Date(education.startDate), "MMM yyyy"),
                        endDate: formatDate(new Date(education.endDate), "MMM yyyy"),
                        id: cnt++
                    },
                    ...state.seekerProfileEducation
                ]
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                } else {
                    toast.error('Failed to add education. Please try again later.');
                }
            } else {
                toast.error('Failed to add education. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileUpdateEducation: async (education) => {
        try {
            await axios.patch(`${config.API_BASE_URL}/seekers/educations/${education.id}`, {
                ...education,
                start_date: new Date(education.startDate).toISOString(),
                end_date: education.endDate ? new Date(education.endDate).toISOString() : undefined,
                school_name: education.institution,
                field: education.fieldOfStudy,
            })
            set((state) => ({
                seekerProfileEducation: state.seekerProfileEducation.map((edu) =>
                    edu.id === education.id ? {
                        ...edu,
                        ...education,
                        startDate: formatDate(new Date(education.startDate), "MMM yyyy"),
                        endDate: formatDate(new Date(education.endDate), "MMM yyyy"),
                    } : { ...edu }
                )
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        toast.error(error);
                    });
                } else {
                    toast.error('Failed to update education. Please try again later.');
                }
            } else {
                toast.error('Failed to update education. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileRemoveEducation: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/educations/${id}`);
            set((state) => ({
                seekerProfileEducation: state.seekerProfileEducation.filter((edu) => edu.id !== id)
            }));
        } catch (err) { 
            toast.error('Failed to remove education. Please try again later.');
            throw err;
        }
    },

    seekerProfileFetchSkills: async () => {
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/skills`);
            set({ seekerProfileSkills: res.data.map((skill: {skillid: number; skillname: string}) => ({id: skill.skillid, name: skill.skillname})) });
        } catch (err) {
            toast.error('Failed to fetch skills. Please try again later.');
        }
    },

    seekerProfileAddSkill: async (id) => {
        const { seekerProfileSkillsFormData } = get();
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/skills`, {skills: [{skillId: id}]});
            set((state) => ({
                seekerProfileSkills: [seekerProfileSkillsFormData.find(skill => skill.id === id)!, ...state.seekerProfileSkills,]
            }))
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    if(validationErrors.length !== 0) {
                        validationErrors.forEach((error: string) => {
                            toast.error(error);
                        });
                    }
                    else {
                        toast.error('Skill already exists.');
                    }
                } else {
                    toast.error('Failed to add skill. Please try again later.');
                }
            } else {
                toast.error('Failed to add skill. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileRemoveSkill: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/skills/${id}`);
            set((state) => ({
                seekerProfileSkills: state.seekerProfileSkills.filter((skill) => skill.id !== id)
            }))
        } catch (err) {
            toast.error('Failed to remove skill. Please try again later.');
            throw err;
        }
    },

    // TODO: Skills for the user to select from 
    seekerProfileFetchSkillsFormData: async () => {

    },

    seekerProfileFetchCVs: async () => {
        const { userRole, seekerProfileSelectedSeekerData } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/cvs`, {
                params: userRole === UserRole.SEEKER ? {}: { 
                ...seekerProfileSelectedSeekerData
            }});
            set({
                seekerProfileCVs: res.data.cvNames.map((cv: {id: number; name: string; created_at: string}) => ({
                    ...cv,
                    createdAt: formatDistanceToNow(new Date(cv.created_at), { addSuffix: true })
                }))
            });
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    set({ seekerProfileCVs: [] });
                    toast.info('No CVs found.');
                } else {
                    toast.error(`Failed to fetch CVs: ${err.response?.statusText || 'Network error'}`);
                }
            } else {
                toast.error('Failed to fetch CVs: Unexpected error');
            }
        }
    },

    seekerProfileAddCV: async (cv, createdAt) => {
        const { seekerProfileCVs } = get();
        if (seekerProfileCVs.length === 5) {
            toast.error('You can only have 5 CVs');
            return;
        }
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/cvs`, cv, {
                headers: {
                    'File-Name': cv.name,
                    'Content-Type': cv.type,
                }
            });

            set((state) => ({
                seekerProfileCVs: [
                    {
                        name: cv.name,
                        createdAt: formatDistanceToNow(new Date(createdAt), { addSuffix: true }),
                        id: cnt++
                    },
                    ...state.seekerProfileCVs
                ]
            }));
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    toast.error('CVs limit reached. Please remove an existing CV before adding a new one.');
                } else if (err.response?.status === 400) {
                    toast.error('Invalid CV format. Please upload a valid file.');
                } else {
                    toast.error(`Failed to add CV: ${err.response?.statusText || 'Network error'}`);
                }
            } else {
                toast.error('Failed to add CV: Unexpected error');
            }
            throw err;
        }
    },

    seekerProfileRemoveCV: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/cvs/${id}`);
            set((state) => ({
                seekerProfileCVs: state.seekerProfileCVs.filter((cv) => cv.id !== id)
            }));
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status && err.response.status >= 400 && err.response.status < 600) {
                    toast.error(`Failed to remove CV: ${err.response.statusText || 'Unknown error'}`);
                } else {
                    toast.error('Failed to remove CV: Network error');
                }
            } else {
                toast.error('Failed to remove CV: Unexpected error');
            }
            throw err;
        }
    },

    // will be implemented to request the CV file from the API
    seekerProfileGetCV: async (id) => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/seekers/cvs/${id}`, {
                responseType: 'arraybuffer'
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    seekerProfileFetchReviews: async () => {
        const { seekerProfileReviewsHasMore, seekerProfileReviewsIsLoading } = get();
        if (!seekerProfileReviewsHasMore || seekerProfileReviewsIsLoading) return;

        set({ seekerProfileReviewsIsLoading: true });

        // mock API call
        await new Promise<void>((resolve) => setTimeout(() => {
            set((state) => {
                const startIndex = (state.seekerProfileReviewsPage - 1) * paginationLimit;
                const endIndex = startIndex + paginationLimit;
                const newReviews = mockReviews.slice(startIndex, endIndex).map((review) => ({
                    ...review,
                    createdAt: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                }));

                return {
                    seekerProfileReviews: [...state.seekerProfileReviews, ...newReviews],
                    seekerProfileReviewsHasMore: endIndex < mockReviews.length,
                    seekerProfileReviewsPage: state.seekerProfileReviewsPage + 1,
                    seekerProfileReviewsIsLoading: false
                }
            });
            resolve();
        }, 1000));
    },

    seekerProfileUpdateReview: async (review) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileReviews: state.seekerProfileReviews.map((rev) => rev.id === review.id ?
                        { ...rev, ...review } : { ...rev }
                    )
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileRemoveReview: async (id) => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                set((state) => ({
                    seekerProfileReviews: state.seekerProfileReviews.filter((rev) => rev.id !== id)
                }));
                resolve();
            }, 1000);
        });
    },

    seekerProfileClear: () => {
        set({
            seekerProfileInfo: {
                name: '',
                country: '',
                city: '',
                phone: '',
                gender: '',
                birthDate: '',
            },
            seekerCredentials: {
                email: '',
                password: ''
            },
            seekerProfileExperience: [],
            seekerProfileEducation: [],
            seekerProfileSkills: [],
            seekerProfileCVs: [],
            seekerProfileReviews: [],
            seekerProfileReviewsHasMore: true,
            seekerProfileReviewsPage: 1,
            seekerProfileReviewsIsLoading: false,
        });
    }
});