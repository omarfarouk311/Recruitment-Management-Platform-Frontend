import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
const API_BASE_URL = config.API_BASE_URL;
import { CompanyRecruitmentProcesses as processes } from "../../types/companyDashboard";



export interface CompanyRecruitmentProcessesSlice {
    processes: processes[];
    processesPage: number;
    processesHasMore: boolean;
    processesIsLoading: boolean;
    processId: number | null;

    fetchProcesses: () => Promise<void>;
    setProcessId: (processId: number | null) => void;
    resetProcesses: () => void;
    deleteProcess: (processId: number) => Promise<void>;
    // addProcess: (name: string, numOfPhases: number) => Promise<void>;
    updateProcess: (processId: number, name: string, numOfPhases: number) => Promise<void>;

}

export const createCompanyRecruitmentProcessesSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyRecruitmentProcessesSlice
> = (set, get) => ({
    processes: [],
    processesPage: 1,
    processesHasMore: true,
    processesIsLoading: false,
    processId: null,
    fetchProcesses: async () => {
        const { processesPage, processesHasMore, processesIsLoading } = get();
        if (processesIsLoading || !processesHasMore) return;

        set({ processesIsLoading: true });

        try {
       const response = await axios.get(`${API_BASE_URL}/recruitment_processes`, {
            params: { 
                page: processesPage,
                limit: 10
            },
        });
            const newProcesses = response.data.recruitment_process;
            console.log("response", newProcesses);
                set((state) => ({
                    processes: [
                        ...state.processes,
                        ...newProcesses
                    ],
                    processesHasMore: newProcesses.length > 0,
                    processesPage: state.processesPage + 1,
                    processesIsLoading: false
                }));

        } catch (error) {
            console.error("Error fetching recruitment processes:", error);
            set({ processesIsLoading: false });
        }
    },
    setProcessId: (processId: number | null) => {
        set({ processId });
    },
    resetProcesses: () => {
        set({
            processes: [],
            processesPage: 1,
            processesHasMore: true,
            processesIsLoading: false,
            processId: null
        });
    },
    deleteProcess: async (processId: number) => {
        try {
            await axios.delete(`${API_BASE_URL}/recruitment_processes/${processId}`);
            set((state) => ({
                processes: state.processes.filter((process) => process.id !== processId)
            }));
        } catch (error) {
            console.error("Error deleting recruitment process:", error);
        }
    },
    

    updateProcess: async (processId: number, name: string, numOfPhases: number) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/recruitment_processes/${processId}`, {
                name,
                numOfPhases
            });
            set((state) => ({
                processes: state.processes.map((process) =>
                    process.id === processId ? { ...process, ...response.data } : process
                )
            }));
        } catch (error) {
            console.error("Error updating recruitment process:", error);
        }
    }

});
