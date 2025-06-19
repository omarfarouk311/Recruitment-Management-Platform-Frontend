import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import axios from "axios";
import config from "../../../config/config";
const API_BASE_URL = config.API_BASE_URL;
import { Phase, Process as processes} from "../../types/companyDashboard";
import { showErrorToast } from '../../util/errorHandler';


export interface CompanyRecruitmentProcessesSlice {
    // processes: processes[];
    processesPage: number;
    processesHasMore: boolean;
    processesIsLoading: boolean;
    processId: number | null;

    fetchProcesses: () => Promise<processes[]>;
    fetchProcessById?: (processId: number) => Promise<processes | null>;
    setProcessId: (processId: number | null) => void;
    resetProcesses: () => void;
    deleteProcess: (processId: number, processesArray:processes[], setProcesses: React.Dispatch<React.SetStateAction<processes[]>>) => Promise<void>;
    // addProcess: (name: string, numOfPhases: number) => Promise<void>;
    updateProcess: (processId:number, name: string, phases: Phase[]) => Promise<void>;
    addProcess: (name: string, phases: Phase[]) => Promise<void>;

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
        if (processesIsLoading || !processesHasMore) return [];

        set({ processesIsLoading: true });
        try {
            // First fetch the list of processes
            const response = await axios.get(`${API_BASE_URL}/recruitment_processes`, {
                params: { 
                    page: processesPage,
                    limit: 10
                },
            });

            console.log("Fetched processes:", response.data.recruitment_process);
            // Then fetch phases for each process in parallel
         const processesWithPhases = await Promise.all(
            response.data.recruitment_process.map(async (process: processes) => {
                try {
                // Fetch phases for this specific process
                const phasesResponse = await axios.get(
                    `${API_BASE_URL}/recruitment_processes/${process.id}`
                );
                
                return {
                    ...process,
                    phases: phasesResponse.data.recruitment_process.map((phase: any) => ({
                    ...phase,
                    // Ensure each phase has a unique ID
                    id: phase.id || `phase-${process.id}-${crypto.randomUUID()}`
                    }))
                };

                } catch (error) {
                console.error(`Error fetching phases for process ${process.id}:`, error);
                return {
                    ...process,
                    phases: [] // Return empty array if phases fetch fails
                };
                }
            })
            );

            console.log("Processes with phases:", processesWithPhases);
            return processesWithPhases;
        } catch (error) {
            console.error('Error fetching processes:', error);
            return [];
        } finally {
            set({processesIsLoading: false });
        }
    },
    setProcessId: (processId: number | null) => {
        set({ processId });
    },
    resetProcesses: () => {
        set({
            // processes: [],
            processesPage: 1,
            processesHasMore: true,
            processesIsLoading: false,
            processId: null
        });
    },
    deleteProcess: async (processId: number, processesArray:processes[], setProcesses: React.Dispatch<React.SetStateAction<processes[]>>) => {
        try {
            set({ processesIsLoading: true });
            await axios.delete(`${API_BASE_URL}/recruitment_processes/${processId}`);
            set({ processesIsLoading: false });
            setProcesses(processesArray.filter(p => p.id !== processId));

        } catch (error) {

            let errorMessage = "Something went wrong, please try again.";
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                errorMessage = "Recruitment process not found.";
            }
            else if (axios.isAxiosError(error) && error.response?.status === 500) { 
                errorMessage = "This process is being used in the hiring processes.";             
            }

            showErrorToast(errorMessage);
        }
    },
    

    /*

     1 -> assessment
     2 -> interview
     3 -> cv screening
     
    */
    updateProcess: async (processId: number,name: string, phases: Phase[]) => {
        try {
            const transformedPhases = phases.map(phase => {
            const basePhase = {
                phaseNumber: phase.phase_num.toString(),
                phaseName: phase.phasename,
                phaseType: phase.type
            };

            // Only include assessmentId and deadline for Assessment phases (type 1)
            if (phase.type === 1) {
                return {
                ...basePhase,
                assessmentId: phase.assessmentId,
                deadline: phase.deadline
                };
            }
            
            return basePhase;
            });
            console.log("Transformed phases:", transformedPhases);
            await axios.put(`${API_BASE_URL}/recruitment_processes/${processId}`, {
                processName: name,
                phases: transformedPhases

            });
       
        } catch (error) {
            let errorMessage = "Something went wrong, please try again.";
            if(axios.isAxiosError(error) && error.response?.status === 404) {
                errorMessage = "Recruitment process not found.";
            } 
            return showErrorToast(errorMessage);
        }
    },

    addProcess: async (name: string, phases: Phase[]) => {
        try {
                        // Transform phases to match backend expectations
            const transformedPhases = phases.map(phase => {
            const basePhase = {
                phaseNumber: phase.phase_num.toString(),
                phaseName: phase.phasename,
                phaseType: phase.type
            };

            // Only include assessmentId and deadline for Assessment phases (type 1)
            if (phase.type === 1) {
                return {
                ...basePhase,
                assessmentId: phase.assessmentId,
                deadline: phase.deadline
                };
            }
            
            return basePhase;
            });

            console.log("Transformed phases:", transformedPhases);

            await axios.post(`${API_BASE_URL}/recruitment_processes`, {
                processName: name,
                phases: transformedPhases
            });

            set(() => ({
                processesHasMore: true,
                processesPage: 1
            }));
        } catch (error) {
            console.error("Error adding recruitment process:", error);
            throw error; // Re-throw to allow error handling in the UI
        }
},

});
