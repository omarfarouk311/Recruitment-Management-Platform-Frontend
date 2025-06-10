import { StateCreator } from 'zustand';
import { CombinedState } from '../storeTypes';
import axios from "axios";
import config from "../../../config/config.ts";
import { showErrorToast } from '../../util/errorHandler.ts';
import { authRefreshToken } from '../../util/authUtils.ts';

export interface SharedEntitiesSlice {
    sharedEntitiesIndustryOptions: { value: string, label: string }[];
    sharedEntitiesSetIndustryOptions: () => Promise<void>;
}

export const createSharedEntitiesSlice: StateCreator<CombinedState, [], [], SharedEntitiesSlice> = (set, get) => ({
    sharedEntitiesIndustryOptions: [],

    sharedEntitiesSetIndustryOptions: async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/industries/`, { withCredentials: true });
            set({
                sharedEntitiesIndustryOptions: res.data.map((obj: any) => ({
                    value: obj.id.toString(),
                    label: obj.name,
                })),
            });
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const succeeded = await authRefreshToken();
                    if (succeeded) {
                        get().sharedEntitiesSetIndustryOptions();
                    }
                }
                else {
                    showErrorToast('Error fetching industries');
                }
            }
        }
    }
});