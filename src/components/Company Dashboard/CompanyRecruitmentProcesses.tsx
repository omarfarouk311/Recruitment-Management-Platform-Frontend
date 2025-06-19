import React, { useEffect, useState } from "react";
import { Edit3, Trash2, PlusCircle } from "lucide-react";
import RecruitmentProcessDialog from '../common/RecruitmentProcessDialog';
import useStore from "../../stores/globalStore";
import { Process, Phase} from "../../types/companyDashboard";
import axios from "axios";


interface Assessment {
    id: number;
    name: string;
}

const CompanyRecruitmentProcesses: React.FC = () => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isFetchingAssessments, setIsFetchingAssessments] = useState(false);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetch = useStore.useFetchProcesses();
    const addProcess = useStore.useAddProcess();
    const deleteProcess = useStore.useDeleteProcess();
    const resetProcesses = useStore.useResetProcesses();
    const updateProcess = useStore.useUpdateProcess();
    // const processes = useStore.useProcesses();

    useEffect(() => {
        // Fetch initial processes when component mounts
        setProcesses([]); // Clear previous state
        resetProcesses(); // Reset processes state before fetching
        fetchProcesses();
    }, [])

    // Fetch all processes
    const fetchProcesses = async () => {
        setIsLoading(true);
        try {
            const processes = await fetch();
            setProcesses(processes);
        } catch (error) {
            console.error('Error fetching processes:', error);
        } finally {
            setIsLoading(false);
        }
    };


    // Delete process
    const handleDelete = async (id: number, processesArray: Process[], setProcesses: React.Dispatch<React.SetStateAction<Process[]>>) => {
        try {

            await deleteProcess(id, processesArray, setProcesses);
            // setProcesses(processes.filter(process => process.id !== id));
            
        } catch (error) {
            console.error('Error deleting process:', error);
        }
    };

    // Save process (create or update)
const handleSaveProcess = async (processData: { name: string; phases: Phase[] }) => {
    try {
        console.log("Saving process:", processData);
        
        if (isEditMode && selectedProcess?.id) {
            // Update existing process
            await updateProcess(selectedProcess.id, processData.name, processData.phases);
            
            // Update local state
            setProcesses(prevProcesses => 
                prevProcesses.map(p => 
                    p.id === selectedProcess.id 
                        ? { 
                            ...p, 
                            name: processData.name,
                            num_of_phases: processData.phases.length,
                            phases: processData.phases
                          } 
                        : p
                )
            );
        } else {
            // Create new process
            await addProcess(processData.name, processData.phases);
             const newProcess: Process = {
                    id: Date.now(), // Temporary ID, replace with actual ID from backend
                    name: processData.name,
                    num_of_phases: processData.phases.length,
                    phases: processData.phases
                };
                setProcesses([...processes, newProcess]);
        }
        
        handleCloseDialog(); // Close the dialog after successful save
    } catch (error) {
        console.error('Error saving process:', error);
        // Optionally show error to user
    }
};

    const fetchAssessments = async () => {
        setIsFetchingAssessments(true);
        try {
            const response = await axios.get('http://localhost:8080/api/assessments/');
            if (response.data.success) {
                // Store only id and name
                const simplifiedAssessments = response.data.assessments.map((a: any) => ({
                    id: a.id,
                    name: a.name
                }));
                setAssessments(simplifiedAssessments);
                console.log('Fetched assessments:', simplifiedAssessments);
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setIsFetchingAssessments(false);
        }
    };
    // Open dialog for adding new process
    const handleAddProcess = async () => {
        console.log("Fetching assessments for new process");
        await fetchAssessments();
        console.log("Adding new process");
        setSelectedProcess(null);
        setIsEditMode(false);
        setShowDialog(true);
    };

    // Open dialog for editing existing process
    const handleEditProcess = async (process: Process) => {
        // const fullProcess = await fetchProcessById(process.id);
        console.log("Editing process:", process);
        await fetchAssessments();
        setSelectedProcess(process);
        console.log("Selected process for edit:", process);
        setIsEditMode(true);
        setShowDialog(true);
    };

    // Close dialog and reset state
    const handleCloseDialog = () => {
        setShowDialog(false);
        setSelectedProcess(null);
        setIsEditMode(false);
    };


   return (
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recruitment Processes</h1>
                    <p className="mt-2 text-base text-gray-600">
                        Manage your company's recruitment workflows and phases
                    </p>
                </div>
                <button
                    onClick={handleAddProcess}
                    className="flex items-center text-sm font-semibold text-gray-500 hover:text-black">

                    <PlusCircle size={30} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : processes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-50 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        Number of Phases
                                    </th>
                                    <th scope="col" className="px-8 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processes.map((process) => (
                                    <tr 
                                        key={process.id} 
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleEditProcess(process)}
                                    >
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-base font-medium text-gray-900">{process.name}</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {process.num_of_phases} {process.num_of_phases === 1 ? 'Phase' : 'Phases'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right text-base font-medium">
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditProcess(process);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(process.id, processes, setProcesses);
                                                    }}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 px-6">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No recruitment processes found</h3>
                        <p className="mt-2 text-base text-gray-600 mb-6">
                            Get started by creating your first recruitment process
                        </p>
                        <button
                            onClick={handleAddProcess}
                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                            <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                            Add New Process
                        </button>
                    </div>
                )}
            </div>

            {/* Dialog */}
            <RecruitmentProcessDialog
                isOpen={showDialog}
                onClose={handleCloseDialog}
                onSave={handleSaveProcess}
                initialData={selectedProcess ? { ...selectedProcess, phases: selectedProcess.phases ?? [] } : null}
                isEditMode={isEditMode}
                assessments={assessments}
                isFetchingAssessments={isFetchingAssessments}
            />
        </div>
    );
};

export default CompanyRecruitmentProcesses;
