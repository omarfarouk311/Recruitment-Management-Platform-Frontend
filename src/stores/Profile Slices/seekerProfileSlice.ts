import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { Experience, Education, Skill, SeekerProfileInfo, UserCredentials } from '../../types/profile.ts';
import { CV } from '../../types/profile.ts';
import { Review } from '../../types/review.ts';
import config from "../../../config/config.ts";
import { formatDistanceToNow, formatDate } from 'date-fns';
import axios from 'axios';
import { UserRole } from '../User Slices/userSlice.ts';
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';


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
    setSeekerProfileSelectedSeekerData: (data: {seekerId?: number, jobId?: number}) => void;

    seekerProfileSkillsFormData: Skill[];
    seekerProfileFetchSkillsFormData: () => Promise<void>;
    seekerProfileClear: () => void;
    seekerProfileFetchAll: () => Promise<void>;
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
    
    setSeekerProfileSelectedSeekerData: (data) => {
        set({ seekerProfileSelectedSeekerData: data });
    },

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
            },
            userImage: `${config.API_BASE_URL}/seekers/profiles/${seekerProfileSelectedSeekerData.seekerId ?? userId}/image`
        });
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
            let res
            try {
                res = await axios.put(`${config.API_BASE_URL}/seekers/profiles/`, {
                    name: profile.name,
                    country: profile.country,
                    city: profile.city,
                    phoneNumber: profile.phone,
                    dateOfBirth: (new Date(profile.birthDate)).toISOString(),
                    gender: profile.gender === 'male'
                });
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }  
            }

            if(!res) {
                res = await axios.put(`${config.API_BASE_URL}/seekers/profiles/`, {
                    name: profile.name,
                    country: profile.country,
                    city: profile.city,
                    phoneNumber: profile.phone,
                    dateOfBirth: (new Date(profile.birthDate)).toISOString(),
                    gender: profile.gender === 'male'
                });
            }
            
            let imageRes;
            if(profile.image instanceof File) {
                try {
                    imageRes = await axios.post(`${config.API_BASE_URL}/seekers/profiles/${userId}/image`, profile.image, {
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'File-Name': profile.image.name,
                        }
                    });
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        if (err.response?.status === 401) {
                            await authRefreshToken();
                        }
                    }
                }
                if(!imageRes) {
                    imageRes = await axios.post(`${config.API_BASE_URL}/seekers/profiles/${userId}/image`, profile.image, {
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'File-Name': profile.image.name,
                        }
                    });
                }
            }

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
                        showErrorToast(error);
                    });
                }
            }
            throw err;
        }
    },

    seekerProfileFetchEmail: async () => {
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
            showErrorToast('Failed to fetch experiences. Please try again later.');
        }
    },

    seekerProfileAddExperience: async (experience) => {
        try {
            let res = await axios.post(`${config.API_BASE_URL}/seekers/experiences`, {
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
                        id: res.data.id
                    },
                    ...state.seekerProfileExperience
                ]
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        showErrorToast(error);
                    });
                }
                else {
                    showErrorToast('Failed to add experience. Please try again later.');
                }
            } else {
                showErrorToast('Failed to add experience. Please try again later.');
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
                        showErrorToast(error);
                    });
                } else {
                    showErrorToast('Failed to update experience. Please try again later.');
                }
            } else {
                showErrorToast('Failed to update experience. Please try again later.');
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
                        showErrorToast(error);
                    });
                } else {
                    showErrorToast('Failed to remove experience. Please try again later.');
                }
            } else {
                showErrorToast('Failed to remove experience. Please try again later.');
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
            showErrorToast('Failed to fetch education. Please try again later.');
        }
    },

    seekerProfileAddEducation: async (education) => {
        try {
            let res = await axios.post(`${config.API_BASE_URL}/seekers/educations/add`, {
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
                        id: res.data.id
                    },
                    ...state.seekerProfileEducation
                ]
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        showErrorToast(error);
                    });
                } else {
                    showErrorToast('Failed to add education. Please try again later.');
                }
            } else {
                showErrorToast('Failed to add education. Please try again later.');
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
                        showErrorToast(error);
                    });
                } else {
                    showErrorToast('Failed to update education. Please try again later.');
                }
            } else {
                showErrorToast('Failed to update education. Please try again later.');
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
            showErrorToast('Failed to remove education. Please try again later.');
            throw err;
        }
    },

    seekerProfileFetchSkills: async () => {
        const { seekerProfileSelectedSeekerData } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/skills`, {
                params: {
                    seekerId: seekerProfileSelectedSeekerData.seekerId,
                }
            });
            set({ seekerProfileSkills: res.data.map((skill: {skillid: number; skillname: string}) => ({id: skill.skillid, name: skill.skillname})) });
        } catch (err) {
            showErrorToast('Failed to fetch skills. Please try again later.');
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
                            showErrorToast(error);
                        });
                    }
                    else {
                        showErrorToast('Skill already exists.');
                    }
                } else {
                    showErrorToast('Failed to add skill. Please try again later.');
                }
            } else {
                showErrorToast('Failed to add skill. Please try again later.');
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
            showErrorToast('Failed to remove skill. Please try again later.');
            throw err;
        }
    },

    
    seekerProfileFetchSkillsFormData: async () => {
        try {
            let res;
            try {
                res = await axios.get(`${config.API_BASE_URL}/skills`);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }
            }
            if (!res) {
                res = await axios.get(`${config.API_BASE_URL}/skills`);
            }
            set({
               seekerProfileSkillsFormData: [{name: "Select Skill", id: ""}, ...res.data]
            })
        } catch (err) {

        }
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
                    createdAt: cv.created_at? formatDistanceToNow(new Date(cv.created_at), { addSuffix: true }): '',
                }))
            });
        } catch(err) {
            if (axios.isAxiosError(err)) {
                showErrorToast(`Failed to fetch CVs: ${err.response?.statusText || 'Network error'}`);
            } else {
                showErrorToast('Failed to fetch CVs: Unexpected error');
                console.error(err);
            }
        }
    },

    seekerProfileAddCV: async (cv, createdAt) => {
        const { seekerProfileCVs } = get();
        if (seekerProfileCVs.length === 5) {
            showErrorToast('You can only have 5 CVs');
            return;
        }
        try {
            let res = await axios.post(`${config.API_BASE_URL}/seekers/cvs`, cv, {
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
                        id: res.data.id
                    },
                    ...state.seekerProfileCVs
                ]
            }));
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    showErrorToast('CVs limit reached. Please remove an existing CV before adding a new one.');
                } else if (err.response?.status === 400) {
                    showErrorToast('Invalid CV format. Please upload a valid file.');
                } else {
                    showErrorToast(`Failed to add CV: ${err.response?.statusText || 'Network error'}`);
                }
            } else {
                showErrorToast('Failed to add CV: Unexpected error');
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
                    showErrorToast(`Failed to remove CV: ${err.response.statusText || 'Unknown error'}`);
                } else {
                    showErrorToast('Failed to remove CV: Network error');
                }
            } else {
                showErrorToast('Failed to remove CV: Unexpected error');
            }
            throw err;
        }
    },

    
    seekerProfileGetCV: async (id) => {
        const { seekerProfileSelectedSeekerData } = get();
        try {
            const res = await axios.get(`${config.API_BASE_URL}/seekers/cvs/${id}`, {
                responseType: 'arraybuffer',
                params: {
                    seekerId: seekerProfileSelectedSeekerData.seekerId,
                    jobId: seekerProfileSelectedSeekerData.jobId
                }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    seekerProfileFetchReviews: async () => {
        const { seekerProfileReviewsHasMore, seekerProfileReviewsIsLoading, seekerProfileReviewsPage, seekerProfileSelectedSeekerData } = get();
        if (!seekerProfileReviewsHasMore || seekerProfileReviewsIsLoading) return;

        set({ seekerProfileReviewsIsLoading: true });
        try {
            if (seekerProfileSelectedSeekerData.jobId) {
                return;
            }
            let res;
            try {
                res = await axios.get(`${config.API_BASE_URL}/seekers/reviews`, {
                    params: {
                        page: seekerProfileReviewsPage
                    }
                })
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }
                throw err;
            }

            if(!res) {
                res = await axios.get(`${config.API_BASE_URL}/seekers/reviews`, {
                    params: {
                        page: seekerProfileReviewsPage
                    }
                })
            }

            set((state) => {
                const newReviews = res.data.map((review: Review & {companyId: number; companyName: string}) => ({
                    ...review,
                    createdAt: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }),
                    companyData: {
                        id: review.companyId,
                        name: review.companyName
                    }
                }));
    
                return {
                    seekerProfileReviews: [...state.seekerProfileReviews, ...newReviews],
                    seekerProfileReviewsHasMore: res.data.length > 0,
                    seekerProfileReviewsPage: state.seekerProfileReviewsPage + 1,
                    seekerProfileReviewsIsLoading: false
                }
            });
        } catch(err) {
            if (axios.isAxiosError(err)) {
                showErrorToast(`Failed to fetch reviews: ${err.response?.statusText || 'Network error'}`);
            } else {
                showErrorToast('Failed to fetch reviews: Unexpected error');
            }
            set({ seekerProfileReviewsIsLoading: false });
        }
    },

    seekerProfileUpdateReview: async (review) => {
        try {
            let res;
            try {
                res = await axios.put(`${config.API_BASE_URL}/reviews/${review.id}`, {
                    ...review
                });
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }
                throw err;
            }
            if(!res) {
                res = await axios.put(`${config.API_BASE_URL}/reviews/${review.id}`, {
                   ...review
                });
            }
            set((state) => ({
                seekerProfileReviews: state.seekerProfileReviews.map((rev) => rev.id === review.id ?
                    { ...rev, ...review } : { ...rev }
                )
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors = err.response.data.validationErrors;
                    validationErrors.forEach((error: string) => {
                        showErrorToast(error);
                    }); 
                } 
                else {
                    showErrorToast('Failed to update review. Please try again later.');
                }
            }
            else {
                showErrorToast('Failed to update review. Please try again later.');
            }
            throw err;
        }
    },

    seekerProfileRemoveReview: async (id) => {
        try {
            let res;
            try {
                res = await axios.delete(`${config.API_BASE_URL}/reviews/${id}`);
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        await authRefreshToken();
                    }
                }
                throw err;
            }
            if(!res) {
                await axios.delete(`${config.API_BASE_URL}/reviews/${id}`); 
            }
            set((state) => ({
                seekerProfileReviews: state.seekerProfileReviews.filter((rev) => rev.id !== id)
            }));
        }
        catch (err) {
            showErrorToast('Failed to remove review. Please try again later.');
            throw err; 
        }
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
    },

    seekerProfileFetchAll: async () => {
        const { seekerProfileFetchInfo, seekerProfileFetchExperience, seekerProfileFetchEducation, seekerProfileFetchSkills, seekerProfileFetchCVs, seekerProfileFetchReviews } = get();
        await Promise.all([
            seekerProfileFetchInfo(),
            seekerProfileFetchExperience(),
            seekerProfileFetchEducation(),
        ]);

        await Promise.all([
            seekerProfileFetchSkills(),
            seekerProfileFetchCVs(),
            seekerProfileFetchReviews()
        ]);
    }
});