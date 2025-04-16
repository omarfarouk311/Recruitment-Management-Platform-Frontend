import { useEffect, useState } from "react";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { Interviews } from "../../types/recruiterDashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { DashboardSortByFilterOptions } from "../../types/recruiterDashboard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the default CSS for the date picker

const RecruiterInterviews = () => {
    const filters = useStore.useRecruiterInterviewsFilters();
    const setFilters = useStore.useRecruiterInterviewsSetFilters();
    const useData = useStore.useRecruiterInterviewsData;
    const useHasMore = useStore.useRecruiterInterviewsHasMore;
    const useIsLoading = useStore.useRecruiterInterviewsIsLoading;
    const useFetchData = useStore.useRecruiterInterviewsFetchData;
    const useUpdateDate = useStore.useRecruiterInterviewsSetUpateDate(); // Add this to your store
    const fetchData = useFetchData();

    const jobTitles = useStore.useRecruiterJobTitles();

    const resetData = useStore.useResetAllData();

    useEffect(() => {
        resetData();
        fetchData();
    }, []);

    // Function to handle date update
    const handleUpdateDate = async (jobId: number, seekerId: number, newDate: string) => {
        try {
            await useUpdateDate({ jobId, seekerId, date: newDate }); // Call the store function to update the date
        } catch (error) {
            console.error("Failed to update date:", error);
        }
    };


    // State for the date picker
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentJobId, setCurrentJobId] = useState<number | null>(null);
    const [currentSeekerId, setCurrentSeekerId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    // Function to handle date selection
    const handleDateConfirm = () => {
        if (selectedDate && currentJobId && currentSeekerId) {
            // Convert the selected local time to UTC
            const utcDate = new Date(
                Date.UTC(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    selectedDate.getHours(),
                    selectedDate.getMinutes(),
                    selectedDate.getSeconds()
                )
            );

            const formattedDate = utcDate.toISOString(); // Format the date as needed
            handleUpdateDate(currentJobId, currentSeekerId, formattedDate); // Call the update function
            setSelectedDate(null); // Reset the selected date
            setCurrentJobId(null); // Reset the job ID
            setIsModalOpen(false); // Close the modal
            setCurrentSeekerId(null); // Reset the seeker ID
        }
    };

    const columns: ColumnDef<Interviews>[] = [
        {
            key: "userName",
            header: "User Name",
            render: (row) => (
                <Link
                    to={`/seeker/${row.userId}`} // Route with userId
                    className="text-blue-600 hover:underline"
                >
                    {row.userName}
                </Link>
            ),
        },
        {
            key: "jobTitle",
            header: "Job Title",
            render: (row) => (
                <Link
                    to={`/job/${row.jobId}`} // Route with jobId
                    className="text-blue-600 hover:underline"
                >
                    {row.jobTitle}
                </Link>
            ),
        },
        {
            key: "date",
            header: "Date (GMT)",
            render: (row) => {
                const date = new Date(row.date);

                // Format date (e.g., "Jan 15, 2023")
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'GMT'
                });

                // Format time with AM/PM (e.g., "02:30:45 PM")
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'GMT',
                    hour12: false  // This enables AM/PM display
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                        <span className="text-xs text-gray-500">
                            {formattedTime} GMT
                        </span>
                    </div>
                );
            }
        },
        {
            key: "location",
            header: "Location",
            render: (row) => <span>{row.location}</span>,
        },
        {
            key: "candidateLocation",
            header: "Candidate Location",
            render: (row) => <span>{row.candidateLocation}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div>
                    <Button
                        onClick={() => {
                            setCurrentJobId(row.jobId); // Set the job ID for the current row
                            setCurrentSeekerId(row.userId);
                            setSelectedDate(row.date ? new Date(row.date) : null); // Set the current date if available
                            setIsModalOpen(true); // Open the modal
                        }}
                    >
                        Update Date
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[700px] bg-white p-4 rounded-3xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="px-6 py-2 text-3xl font-bold">Interviews</h1>
                <div className="flex items-center py-4 px-6 space-x-6 flex-nowrap z-10">
                    <FilterDropdown
                        label="Sort by Date"
                        options={DashboardSortByFilterOptions.filter(
                            (option) => option.value === "1" || option.value === "-1"
                        )}
                        selectedValue={filters.sortByDate}
                        onSelect={(value) => setFilters({ ...filters, sortByDate: value })}
                    />

                    <FilterDropdown
                        label="Job Title"
                        options={jobTitles && jobTitles.length > 0
                            ? jobTitles.map((title) => ({ value: title, label: title }))
                            : [{ value: '', label: 'No job titles available' }]
                        }
                        selectedValue={filters.jobTitle}
                        onSelect={(value) => setFilters({ ...filters, jobTitle: value })}
                        disabled={!jobTitles || jobTitles.length === 0}
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[580px]">
                <Dashboard
                    columns={columns}
                    useData={useData}
                    useHasMore={useHasMore}
                    useIsLoading={useIsLoading}
                    useFetchData={useFetchData}
                />
            </div>

            {/* Modal for Date Picker */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            showTimeSelect
                            timeFormat="h:mm aa"  // AM/PM format
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa" // "June 5, 2023 2:30 PM"
                            timeCaption="Time"
                            className="border rounded p-2 w-full"
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <Button onClick={handleDateConfirm}>Confirm</Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)} // Close the modal
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;