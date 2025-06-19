import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import type { RecruiterProfileInfo, UserCredentials, RecruiterCompanyInfo } from '../../types/profile.ts';
import { authRefreshToken } from '../../util/authUtils.ts';
import { showErrorToast } from '../../util/errorHandler.ts';
import config from '../../../config/config.ts';
import axios from 'axios';

export interface RecruiterProfileSlice {
    recruiterProfileInfo: RecruiterProfileInfo;
    recruiterCredentials: UserCredentials;
    recruiterCompanyInfo: RecruiterCompanyInfo;
    recruiterProfileFetchInfo: () => Promise<void>;
    recruiterProfileUpdateInfo: (profileData: RecruiterProfileInfo) => Promise<void>;
    recruiterProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;
}

export const createRecruiterProfileSlice: StateCreator<CombinedState, [], [], RecruiterProfileSlice> = (set, get) => ({
    recruiterProfileInfo: {
        name: '',
        image: ''
    },
    recruiterCredentials: {
        email: '',
        password: ''
    },
    recruiterCompanyInfo: {
        company: {
            id: null,
            image: '',
            name: ''
        },
        department: '',
        assignedCandidatesCnt: 0
    },

    recruiterProfileFetchInfo: async () => {
        const { userId } = get();

        try {
            const res = await axios.get(
                `${config.API_BASE_URL}/recruiters/profile-data`,
                { withCredentials: true }
            );

            const data = res.data.recruiterData;
            for (let key in data) {
                if (data[key] === null && key !== 'companyId') {
                    data[key] = '';
                }
            }

            set({
                recruiterProfileInfo: {
                    name: data.recruiterName,
                    image: `${config.API_BASE_URL}/recruiters/${userId}/profile-pic?t=${Date.now()}`
                },
                recruiterCompanyInfo: {
                    company: {
                        id: data.companyId,
                        image: `${config.API_BASE_URL}/companies/${data.companyId}/image?t=${Date.now()}`,
                        name: data.companyName
                    },
                    department: data.department,
                    assignedCandidatesCnt: data.assignedCandidatesCnt
                }
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().recruiterProfileFetchInfo();
                    }
                }
                else {
                    showErrorToast('Failed to fetch profile info');
                }
            }
        }
    },

    recruiterProfileUpdateInfo: async (profileData) => {
        const { userId } = get();
        try {
            await axios.put(
                `${config.API_BASE_URL}/recruiters/profile-data`,
                { recruiterName: profileData.name },
                { withCredentials: true }
            );

            if (profileData.image instanceof File) {
                await axios.put(`${config.API_BASE_URL}/recruiters/profile-pic`, profileData.image, {
                    headers: {
                        "Content-Type": profileData.image.type,
                        "File-Name": profileData.image.name,
                    },
                    withCredentials: true,
                });
            }

            set({
                recruiterProfileInfo: {
                    name: profileData.name,
                    image: `${config.API_BASE_URL}/recruiters/${userId}/profile-pic?t=${Date.now()}`
                },
                userName: profileData.name,
                userImage: `${config.API_BASE_URL}/recruiters/${userId}/profile-pic?t=${Date.now()}`
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        await get().recruiterProfileUpdateInfo(profileData);
                    }
                }
                else if (err.response?.status === 400) {
                    if (err.response.data.message !== 'Validation Error') {
                        showErrorToast(err.response.data.message);
                    }
                    else {
                        const validationErrors: string[] = err.response.data.validationErrors;
                        validationErrors.forEach((error) => {
                            showErrorToast(error);
                        });
                    }
                    throw err;
                }
                else if (err.response?.status === 413) {
                    showErrorToast('Image size exceeded 10MB');
                    throw err;
                }
                else {
                    showErrorToast('Failed to update the profile');
                    throw err;
                }
            }
        }
    },

    recruiterProfileUpdateCredentials: async (credentials) => {
    }
});

export default createRecruiterProfileSlice;