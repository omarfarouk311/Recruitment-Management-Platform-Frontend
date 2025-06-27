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
    seekerProfileFetchInfo: (selectedSeekerId?: number) => Promise<void>;

    seekerCredentials: UserCredentials;
    seekerProfileFetchEmail: () => Promise<void>;
    seekerProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;

    seekerProfileExperience: Experience[];
    seekerProfileFetchExperience: (selectedSeekerId?: number) => Promise<void>;
    seekerProfileAddExperience: (experience: Experience) => Promise<void>;
    seekerProfileUpdateExperience: (experience: Experience) => Promise<void>;
    seekerProfileRemoveExperience: (id: number) => Promise<void>;

    seekerProfileEducation: Education[];
    seekerProfileFetchEducation: (selectedSeekerId?: number) => Promise<void>;
    seekerProfileAddEducation: (education: Education) => Promise<void>;
    seekerProfileUpdateEducation: (education: Education) => Promise<void>;
    seekerProfileRemoveEducation: (id: number) => Promise<void>;

    seekerProfileSkills: Skill[];
    seekerProfileFetchSkills: (selectedSeekerId?: number) => Promise<void>;
    seekerProfileAddSkill: (id: number) => Promise<void>;
    seekerProfileRemoveSkill: (id: number) => Promise<void>;

    seekerProfileCVs: CV[];
    seekerProfileFetchCVs: (selectedSeekerId?: number, jobId?: number) => Promise<void>;
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

    seekerProfileFetchInfo: async (selectedSeekerId) => {
        const { userId, seekerProfileFetchInfo } = get();
        try {
            let res = await axios.get(
                    `${config.API_BASE_URL}/seekers/profiles/${selectedSeekerId ?? userId}`, 
                    { withCredentials: true }
                );
            set({ seekerProfileInfo: { 
                    ...res.data, 
                    phone: res.data.phoneNumber, 
                    birthDate: new Date(res.data.dateOfBirth).toISOString().split('T')[0], 
                    gender: res.data.gender ? 'male' : 'female',
                    image: `${config.API_BASE_URL}/seekers/profiles/${selectedSeekerId ?? userId}/image`
                },
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
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await seekerProfileFetchInfo();
                    }
                }
                showErrorToast('Failed to fetch profile information.');
            }
        }
    },

    seekerProfileUpdateInfo: async (profile) => {
        const { userId } = get();
        try {
            await axios.put(`${config.API_BASE_URL}/seekers/profiles/`, {
                name: profile.name,
                country: profile.country,
                city: profile.city,
                phoneNumber: profile.phone,
                dateOfBirth: (new Date(profile.birthDate)).toISOString(),
                gender: profile.gender === 'male'
            }, { withCredentials: true });
            
            
            if(profile.image instanceof File) {
                await axios.post(`${config.API_BASE_URL}/seekers/profiles/${userId}/image`, profile.image, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                        'File-Name': profile.image.name,
                    },
                    withCredentials: true
                });
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
                    return;
                }
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileUpdateInfo(profile);
                    }
                } 
            }
            showErrorToast('Failed to update profile information.');
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

    seekerProfileFetchExperience: async (selectedSeekerId) => {
        const { userId } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/experiences/${selectedSeekerId ?? userId}`, { withCredentials: true });
            set({
                seekerProfileExperience: res.data.map((exp: Experience & {jobTitle: string}) => ({
                    ...exp,
                    startDate: formatDate(new Date(exp.startDate), "MMM yyyy"),
                    endDate: exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy"): undefined,
                    position: exp.jobTitle,
                }))
            });
        } catch (err) {
            if(axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileFetchExperience();
                }
            }
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
            }, { withCredentials: true });
            set((state) => ({
                seekerProfileExperience: [
                    {
                        ...experience,
                        startDate: formatDate(new Date(experience.startDate), "MMM yyyy"),
                        endDate: experience.endDate ? formatDate(new Date(experience.endDate), "MMM yyyy"): undefined,
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
                    return;
                }
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileAddExperience(experience);
                    }
                }
            }
            showErrorToast('Failed to add experience. Please try again later.');
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
            }, { withCredentials: true });

            set((state) => ({
                seekerProfileExperience: state.seekerProfileExperience.map((exp) =>
                    exp.id === experience.id ? {
                        ...exp,
                        ...experience,
                        startDate: formatDate(new Date(experience.startDate), "MMM yyyy"),
                        endDate: experience.endDate ? formatDate(new Date(experience.endDate), "MMM yyyy"): undefined,
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
                    return;
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        await get().seekerProfileUpdateExperience(experience);
                    }
                }
            }
            showErrorToast('Failed to update experience. Please try again later.');
            throw err;
        }
    },

    seekerProfileRemoveExperience: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/experiences/${id}`, { withCredentials: true });
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
                    return;
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileRemoveExperience(id);
                    }
                }
            }
            showErrorToast('Failed to remove experience. Please try again later.');
            throw err;
        }
    },

    seekerProfileFetchEducation: async (selectedSeekerId) => {
        const { userId } = get();
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/educations/${selectedSeekerId ?? userId}`, { withCredentials: true });
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
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileFetchEducation();
                }
            }
            showErrorToast('Failed to fetch education. Please try again later.');
        }
    },

    seekerProfileAddEducation: async (education) => {
        try {
            let res = await axios.post(`${config.API_BASE_URL}/seekers/educations/add`, {
                degree: education.degree,
                grade: education.grade,
                start_date: new Date(education.startDate).toISOString(),
                end_date: education.endDate ? new Date(education.endDate).toISOString() : undefined,
                school_name: education.institution,
                field: education.fieldOfStudy
            }, { withCredentials: true })
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
                    return;
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileAddEducation(education);
                    }
                }
            } 
            showErrorToast('Failed to add education. Please try again later.');
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
            }, { withCredentials: true })
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
                    return;
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileUpdateEducation(education);
                    }
                }
            }
            showErrorToast('Failed to update education. Please try again later.');
            throw err;
        }
    },

    seekerProfileRemoveEducation: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/educations/${id}`, { withCredentials: true });
            set((state) => ({
                seekerProfileEducation: state.seekerProfileEducation.filter((edu) => edu.id !== id)
            }));
        } catch (err) { 
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileRemoveEducation(id);
                }
            }
            showErrorToast('Failed to remove education. Please try again later.');
            throw err;
        }
    },

    seekerProfileFetchSkills: async (selectedSeekerId) => {
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/skills`, {
                params: {
                    seekerId: selectedSeekerId,
                },
                withCredentials: true
            });
            set({ seekerProfileSkills: res.data.map((skill: {skillid: number; skillname: string}) => ({id: skill.skillid, name: skill.skillname})) });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileFetchSkills(); 
                }
            }
            showErrorToast('Failed to fetch skills. Please try again later.');
        }
    },

    seekerProfileAddSkill: async (id) => {
        const { seekerProfileSkillsFormData } = get();
        try {
            await axios.post(`${config.API_BASE_URL}/seekers/skills`, {skills: [{skillId: id}]}, { withCredentials: true });
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
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileAddSkill(id);
                    }
                }
            }
            showErrorToast('Failed to add skill. Please try again later.');
            throw err;
        }
    },

    seekerProfileRemoveSkill: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/skills/${id}`, { withCredentials: true });
            set((state) => ({
                seekerProfileSkills: state.seekerProfileSkills.filter((skill) => skill.id !== id)
            }))
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileRemoveSkill(id);
                }
            }
            showErrorToast('Failed to remove skill. Please try again later.');
            throw err;
        }
    },

    
    seekerProfileFetchSkillsFormData: async () => {
        try {
            let res = await axios.get(`${config.API_BASE_URL}/skills`, { withCredentials: true });
            set({
               seekerProfileSkillsFormData: [{name: "Select Skill", id: ""}, ...res.data]
            })
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileFetchSkillsFormData();
                }
            }
            showErrorToast('Failed to fetch skills form data. Please try again later.');
        }
    },

    seekerProfileFetchCVs: async (userId, jobId) => {
        const { userRole } = get();
        
        try {
            let res = await axios.get(`${config.API_BASE_URL}/seekers/cvs`, {
                params: userRole === UserRole.SEEKER ? {}: { 
                seekerId: userId,
                jobId
            },
            withCredentials: true
            });
            set({
                seekerProfileCVs: res.data.cvNames.map((cv: {id: number; name: string; created_at: string}) => ({
                    ...cv,
                    createdAt: cv.created_at? formatDistanceToNow(new Date(cv.created_at), { addSuffix: true }): '',
                }))
            });
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileFetchCVs();
                    }
                }
            }
            showErrorToast('Failed to fetch CVs');
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
                },
                withCredentials: true
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
                    return showErrorToast('CVs limit reached. Please remove an existing CV before adding a new one.');
                } else if (err.response?.status === 400) {
                    return showErrorToast('Invalid CV format. Please upload a valid file.');
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileAddCV(cv, createdAt);
                    } 
                }
            }
            showErrorToast('Failed to add CV');
            throw err;
        }
    },

    seekerProfileRemoveCV: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/seekers/cvs/${id}`, { withCredentials: true });
            set((state) => ({
                seekerProfileCVs: state.seekerProfileCVs.filter((cv) => cv.id !== id)
            }));
        } catch(err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status && err.response.status >= 400 && err.response.status < 600) {
                    if (err.response.status === 401) {
                        const success = await authRefreshToken();
                        if (success) {
                            return await get().seekerProfileRemoveCV(id);
                        }
                    } else if (err.response.status === 404) {
                        return showErrorToast('CV not found');
                    } else if (err.response.status === 403) {
                        return showErrorToast('You do not have permission to remove this CV');
                    } else if (err.response.status === 400) {
                        return showErrorToast('Invalid request to remove CV');
                    } else if (err.response.status === 409) {
                        return showErrorToast('You must have at least one CV.');
                    }
                }
            }
            showErrorToast('Failed to remove CV');
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
                },
                withCredentials: true
            });
            return res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileGetCV(id);
                    }
                }
            }
            showErrorToast('Failed to fetch CV');
            throw err;
        }
    },

    seekerProfileFetchReviews: async () => {
        const { seekerProfileReviewsHasMore, seekerProfileReviewsPage, seekerProfileSelectedSeekerData } = get();
        if (!seekerProfileReviewsHasMore) return;

        set({ seekerProfileReviewsIsLoading: true });
        try {
            if (seekerProfileSelectedSeekerData.jobId) {
                return;
            }
            let res = await axios.get(`${config.API_BASE_URL}/seekers/reviews`, {
                params: {
                    page: seekerProfileReviewsPage
                },
                withCredentials: true
            })

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
                    seekerProfileReviewsPage: state.seekerProfileReviewsPage + 1
                }
            });
        } catch(err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileFetchReviews();
                }
            }
            showErrorToast('Failed to fetch reviews');
            
        }
        finally {
            set({ seekerProfileReviewsIsLoading: false });
        }
    },

    seekerProfileUpdateReview: async (review) => {
        try {
            await axios.put(`${config.API_BASE_URL}/reviews/${review.id}`, {
                ...review
            }, { withCredentials: true });
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
                    return;
                } 
                else if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().seekerProfileUpdateReview(review);
                    }
                }
            }
            showErrorToast('Failed to update review. Please try again later.');
            throw err;
        }
    },

    seekerProfileRemoveReview: async (id) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/reviews/${id}`, { withCredentials: true });
            set((state) => ({
                seekerProfileReviews: state.seekerProfileReviews.filter((rev) => rev.id !== id)
            }));
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().seekerProfileRemoveReview(id);
                }
            }
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
        
        await seekerProfileFetchInfo();
        await seekerProfileFetchExperience();
        await seekerProfileFetchEducation();
        await seekerProfileFetchSkills();
        await seekerProfileFetchCVs();
        await seekerProfileFetchReviews();
    }
});