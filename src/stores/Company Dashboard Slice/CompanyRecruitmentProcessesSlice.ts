import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
const API_BASE_URL = config.API_BASE_URL;
import { Phase, Process as processes } from "../../types/companyDashboard";
import { showErrorToast } from '../../util/errorHandler';
import { authRefreshToken } from '../../util/authUtils';

export interface CompanyRecruitmentProcessesSlice {
    processesPage: number;
    processesHasMore: boolean;
    processesIsLoading: boolean;
    processId: number | null;

    fetchProcesses: () => Promise<processes[]>;
    fetchProcessById?: (processId: number) => Promise<processes | null>;
    setProcessId: (processId: number | null) => void;
    resetProcesses: () => void;
    deleteProcess: (processId: number, processesArray: processes[], setProcesses: React.Dispatch<React.SetStateAction<processes[]>>) => Promise<void>;
    updateProcess: (processId: number, name: string, phases: Phase[]) => Promise<void>;
    addProcess: (name: string, phases: Phase[]) => Promise<number>;
}

export const createCompanyRecruitmentProcessesSlice: StateCreator<
    CombinedState,
    [],
    [],
    CompanyRecruitmentProcessesSlice
> = (set, get) => ({
    processesPage: 1,
    processesHasMore: true,
    processesIsLoading: false,
    processId: null,

    fetchProcesses: async () => {
        const { processesPage, processesHasMore } = get();
        if (!processesHasMore) return [];

        set({ processesIsLoading: true });
        try {
            // First fetch the list of processes
            const response = await axios.get(`${API_BASE_URL}/recruitment_processes`, {
                params: {
                    page: processesPage,
                    limit: 10
                },
                withCredentials: true
            });

            // Then fetch phases for each process in parallel
            const processesWithPhases = await Promise.all(
                response.data.recruitment_process.map(async (process: processes) => {
                    try {
                        const phasesResponse = await axios.get(
                            `${API_BASE_URL}/recruitment_processes/${process.id}`,
                            { withCredentials: true }
                        );

                        return {
                            ...process,
                            phases: phasesResponse.data.recruitment_process.map((phase: any) => ({
                                ...phase,
                                id: phase.id || `phase-${process.id}-${crypto.randomUUID()}`
                            }))
                        };
                    } catch (err) {
                        if (axios.isAxiosError(err)) {
                            if (err.response?.status === 401) {
                                const success = await authRefreshToken();
                                if (success) {
                                    return await get().fetchProcesses();
                                }
                            }
                            else {
                                showErrorToast("Something went wrong while fetching the process, please try again.");
                            }
                        }
                        console.error(`Error fetching phases for process ${process.id}:`, err);
                        return {
                            ...process,
                            phases: []
                        };
                    } finally {
                        set({ processesIsLoading: false });
                    }
                })
            );

            return processesWithPhases;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().fetchProcesses();
                    }
                }
                else {
                    showErrorToast("Something went wrong while fetching the processes, please try again.");
                }
            }
            console.error('Error fetching processes:', err);
            return [];
        } finally {
            set({ processesIsLoading: false });
        }
    },

    setProcessId: (processId: number | null) => {
        set({ processId });
    },

    resetProcesses: () => {
        set({
            processesPage: 1,
            processesHasMore: true,
            processesIsLoading: false,
            processId: null
        });
    },

    deleteProcess: async (processId: number, processesArray: processes[], setProcesses: React.Dispatch<React.SetStateAction<processes[]>>) => {
        set({ processesIsLoading: true });
        try {
            await axios.delete(`${API_BASE_URL}/recruitment_processes/${processId}`, {
                withCredentials: true
            });
            setProcesses(processesArray.filter(p => p.id !== processId));
        } catch (err) {
            let errorMessage = "Something went wrong, please try again.";
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().deleteProcess(processId, processesArray, setProcesses);
                    }
                }
                if (err.response?.status === 404) {
                    errorMessage = "Recruitment process not found.";
                }
                else if (err.response?.status === 500) {
                    errorMessage = "This process is being used in the hiring processes.";
                }
            }
            showErrorToast(errorMessage);
        } finally {
            set({ processesIsLoading: false });
        }
    },

    updateProcess: async (processId: number, name: string, phases: Phase[]) => {
        console.log("RAW PHASES DATA:", JSON.parse(JSON.stringify(phases)));
        try {
            set({ processesIsLoading: true });
            const transformedPhases = phases.map(phase => {

                const basePhase = {
                    phaseNumber: phase.phase_num.toString(),
                    phaseName: phase.phasename,
                    phaseType: phase.type
                };

                if (phase.type == 1) {
                    console.log("ASSESSMENT PHASE DETECTED:", phase.assessmentid, phase.deadline);
                    const transformed = {
                        ...basePhase,
                        assessmentId: phase.assessmentid,
                        deadline: phase.deadline
                    };
                    return transformed;
                }
                return basePhase;
            });

            console.log("Transformed phases:", transformedPhases);

            await axios.put(`${API_BASE_URL}/recruitment_processes/${processId}`, {
                processName: name,
                phases: transformedPhases
            }, {
                withCredentials: true
            });
        } catch (err) {
            let errorMessage = "Something went wrong, please try again.";
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) {
                    return await get().updateProcess(processId, name, phases);
                }
            }
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                errorMessage = "Recruitment process not found.";
            }
            showErrorToast(errorMessage);
            throw err;
        }
        finally {
            set({ processesIsLoading: false });
        }
    },

    addProcess: async (name: string, phases: Phase[]) => {
        try {
            const transformedPhases = phases.map(phase => {
                const basePhase = {
                    phaseNumber: phase.phase_num.toString(),
                    phaseName: phase.phasename,
                    phaseType: phase.type
                };

                if (phase.type === 1) {
                    return {
                        ...basePhase,
                        assessmentId: phase.assessmentid,
                        deadline: phase.deadline
                    };
                }

                return basePhase;
            });

            const response = await axios.post(`${API_BASE_URL}/recruitment_processes`, {
                processName: name,
                phases: transformedPhases
            }, {
                withCredentials: true
            });

            set(() => ({
                processesHasMore: true,
                processesPage: 1
            }));

            return response.data.id;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    const success = await authRefreshToken();
                    if (success) {
                        return await get().addProcess(name, phases);
                    }
                }
                else {
                    showErrorToast("Something went wrong while adding the process, please try again.");
                }
            }
            console.error("Error adding recruitment process:", err);
            throw err;
        }
    }
});