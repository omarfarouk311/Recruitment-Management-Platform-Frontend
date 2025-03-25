import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { RecruiterProfileInfo as UserProfile, UserCredentials } from '../../types/profile.ts';
import axios, { AxiosError, CancelTokenSource } from 'axios';

interface ApiError {
    message: string;
    statusCode?: number;
}

export interface RecruiterProfileSlice {
    recruiterProfile: UserProfile;
    recruiterCredentials: UserCredentials;
    loading: boolean;
    error: ApiError | null;

    recruiterProfileSetProfile: (profile: UserProfile) => Promise<void>;
    recruiterSetCredentials: (credentials: UserCredentials) => Promise<void>;
    abortRequests: () => void;
}

export const createRecruiterProfileSlice: StateCreator<
    CombinedState,
    [],
    [],
    RecruiterProfileSlice
> = (set, get) => {
    // Type-safe cancellation tokens
    const cancelTokens: {
        profile: CancelTokenSource;
        credentials: CancelTokenSource;
    } = {
        profile: axios.CancelToken.source(),
        credentials: axios.CancelToken.source()
    };

    return {
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
        loading: false,
        error: null,

        recruiterProfileSetProfile: async (profile) => {
            cancelTokens.profile.cancel('New request initiated');
            cancelTokens.profile = axios.CancelToken.source();

            set({ loading: true, error: null });

            try {
                const response = await axios.put<UserProfile>(
                    '/api/recruiters/profile',
                    profile,
                    { cancelToken: cancelTokens.profile.token }
                );
                set({ recruiterProfile: response.data, loading: false });
            } catch (error) {
                if (axios.isCancel(error)) return;

                const axiosError = error as AxiosError<ApiError>;
                set({
                    error: {
                        message: axiosError.response?.data?.message || 'Profile update failed',
                        statusCode: axiosError.response?.status
                    },
                    loading: false
                });
            }
        },

        recruiterSetCredentials: async (credentials) => {
            cancelTokens.credentials.cancel('New request initiated');
            cancelTokens.credentials = axios.CancelToken.source();

            set({ loading: true, error: null });

            try {
                console.log('Sending request')
                const response = await axios.put<UserCredentials>(
                    'http://localhost:8080/api/recruiters/credentials', // Full URL
                    credentials,
                    {
                        cancelToken: cancelTokens.credentials.token,
                        timeout: 5000
                     }
                );
                console.log('Response data');
                set({ recruiterCredentials: response.data, loading: false });
            } catch (error) {
                if (axios.isCancel(error)) return;

                const axiosError = error as AxiosError<ApiError>;
                set({
                    error: {
                        message: axiosError.response?.data?.message || 'Credentials update failed',
                        statusCode: axiosError.response?.status
                    },
                    loading: false
                });
            }
        },

        abortRequests: () => {
            cancelTokens.profile.cancel('Operation aborted');
            cancelTokens.credentials.cancel('Operation aborted');
            set({ loading: false });
        }
    };
};