import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { RecruiterProfileInfo as UserProfile, UserCredentials } from '../../types/profile.ts';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface RecruiterProfileSlice {
    loading: boolean;
    error: string | null;
    recruiterProfile: UserProfile;
    recruiterCredentials: UserCredentials;

    // Synchronous setters
    recruiterProfileSetProfile: (profile: UserProfile) => void;
    recruiterSetCredentials: (credentials: UserCredentials) => void;

    // Async methods with cancellation support
    fetchRecruiterProfile: () => Promise<() => void>;  
    fetchRecruiterCredentials: () => Promise<() => void>;
    updateRecruiterProfile: (profileData: Partial<UserProfile>) => Promise<() => void>;
    updateRecruiterCredentials: (credentialsData: Partial<UserCredentials>) => Promise<() => void>;
}

export const createRecruiterProfileSlice: StateCreator<CombinedState, [], [], RecruiterProfileSlice> = (set, get) => ({
    recruiterProfile: {
        id: '1',
        recruitername: 'User 1',
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
    loading: false,
    error: null,

    // Synchronous setters
    recruiterProfileSetProfile: (profile) => set({ recruiterProfile: profile }),
    recruiterSetCredentials: (credentials) => set({ recruiterCredentials: credentials }),

    // Async API methods with cancellation
    fetchRecruiterProfile: async () => {
        const source = axios.CancelToken.source();
        let isActive = true;
        console.log('Fetching recruiter profile...');
        try {
            if (isActive) set({ loading: true, error: null });
            const response = await axios.get(`${API_BASE_URL}/recruiters/profile-data`, {
                cancelToken: source.token
            });

            if (isActive) {
                console.log('Recruiter profile data fetched:', response.data);
                set({ recruiterProfile: response.data.recruiterData });
                const { has_image } = response.data.recruiterData;
                if (has_image) {
                    console.log('Fetching profile image...');
                    const profileImage = await axios.get(`${API_BASE_URL}/recruiters/profile-pic`, {
                        responseType: 'blob', // Tell Axios to expect binary data (Blob)
                    });
                    const blobUrl = URL.createObjectURL(profileImage.data); // Convert Blob to a URL
                    set({
                        recruiterProfile: {
                            ...response.data.recruiterData,
                            avatar: blobUrl, // Use the Blob URL in <img>
                        }
                    });
                }
            }
            console.log('Finished fetching recruiter profile data')
        } catch (error) {
            console.log('Error fetching recruiter profile:', error);
            if (isActive && !axios.isCancel(error)) {
                set({
                    error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to fetch profile'
                });
            }
        } finally {
            if (isActive) set({ loading: false });
        }

        return () => {
            isActive = false;
            source.cancel('Request canceled due to component unmount');
        };
    },

    fetchRecruiterCredentials: async () => {
        const source = axios.CancelToken.source();
        let isActive = true;

        try {
            if (isActive) set({ loading: true, error: null });
            // call the end point that will return email and password
            // const response = await axios.get(`${API_BASE_URL}/recruiters/credentials`, {
            //     cancelToken: source.token
            // });

            // if (isActive) set({ recruiterCredentials: response.data });
        } catch (error) {
            if (isActive && !axios.isCancel(error)) {
                set({
                    error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to fetch credentials'
                });
            }
        } finally {
            if (isActive) set({ loading: false });
        }

        return () => {
            isActive = false;
            source.cancel('Request canceled due to component unmount');
        };
    },

    updateRecruiterProfile: async (profileData) => {
        const source = axios.CancelToken.source();
        let isActive = true;

        try {
            if (isActive) set({ loading: true, error: null });
            const response = await axios.patch(
                `${API_BASE_URL}/recruiters/profile-data`,
                profileData,
                { cancelToken: source.token }
            );
            if (isActive) set({
                recruiterProfile: { ...get().recruiterProfile, ...response.data }
            });
        } catch (error) {
            if (isActive && !axios.isCancel(error)) {
                set({
                    error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to update profile'
                });
                throw error;
            }
        } finally {
            if (isActive) set({ loading: false });
        }

        return () => {
            isActive = false;
            source.cancel('Request canceled due to component unmount');
        };
    },

    updateRecruiterCredentials: async (credentialsData) => {
        const source = axios.CancelToken.source();
        let isActive = true;

        try {
            if (isActive) set({ loading: true, error: null });
            // const response = await axios.patch(
            //     `${API_BASE_URL}/recruiters/credentials`,
            //     credentialsData,
            //     { cancelToken: source.token }
            // );

            // // Only update non-sensitive fields
            // if (isActive) set({
            //     recruiterCredentials: {
            //         ...get().recruiterCredentials,
            //         ...response.data
            //     }
            // });
        } catch (error) {
            if (isActive && !axios.isCancel(error)) {
                set({
                    error: axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Failed to update credentials'
                });
                throw error;
            }
        } finally {
            if (isActive) set({ loading: false });
        }

        return () => {
            isActive = false;
            source.cancel('Request canceled due to component unmount');
        };
    }
});

export default createRecruiterProfileSlice;