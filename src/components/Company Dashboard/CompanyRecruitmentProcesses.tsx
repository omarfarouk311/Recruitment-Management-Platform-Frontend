import { useEffect } from "react";
import useStore from "../../stores/globalStore";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { CompanyRecruitmentProcesses as processesDashboard } from "../../types/companyDashboard";
import { Edit3, Trash2 } from "lucide-react";

const CompanyRecruitmentProcesses = () => {
    const processes = useStore.useProcesses;
    const processesIsLoading = useStore.useProcessesIsLoading;
    const getProcesses = useStore.useFetchProcesses;
    const fetchProcesses = getProcesses();
    const deleteProcess = useStore.useDeleteProcess();
    const setProcessId = useStore.useSetProcessId();
    const resetProcesses = useStore.useResetProcesses();

    const handleDelete = async (id: number) => {
            await deleteProcess(id);
            fetchProcesses();
        
    };


    const columns: ColumnDef<processesDashboard>[] = [
        {
            key: "name",
            header: "Name",
        },
        {
            key: "num_of_phases", 
            header: "Number of Phases",
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        resetProcesses();
        fetchProcesses();
    }, []);

    return (
        <div className="flex flex-col h-full relative">
            <div className="shrink-0">
   <div className="flex justify-between items-center px-6 py-2">
                    <h1 className="text-3xl font-bold">Recruitment Process</h1>
                    <button 
                    // onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Process
                </button>
                </div>            </div>
            
            <div className="flex-1 overflow-y-auto">
                <Dashboard
                    columns={columns}
                    useData={processes}
                    useHasMore={useStore.useProcessesHasMore}
                    useIsLoading={processesIsLoading}
                    useFetchData={getProcesses}
                />
            </div>
        </div>
    );
};

export default CompanyRecruitmentProcesses;