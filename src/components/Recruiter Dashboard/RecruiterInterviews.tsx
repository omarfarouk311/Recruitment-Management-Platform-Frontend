import { useEffect, useState } from "react";
import Dashboard from "../common/Dashboard";
import { ColumnDef } from "../common/Dashboard";
import { Interviews } from "../../types/recruiterDashboard";
import FilterDropdown from "../Filters/FilterDropdown";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { Link } from "react-router-dom";
import { DashboardSortByFilterOptions } from "../../types/recruiterDashboard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RecruiterInterviews = () => {
    const filters = useStore.useRecruiterInterviewsFilters();
    const setFilters = useStore.useRecruiterInterviewsSetFilters();
    const useData = useStore.useRecruiterInterviewsData;
    const useHasMore = useStore.useRecruiterInterviewsHasMore;
    const useIsLoading = useStore.useRecruiterInterviewsIsLoading;
    const useFetchData = useStore.useRecruiterInterviewsFetchData;
    const useUpdateInterview = useStore.useRecruiterInterviewsSetUpdateInterview();
    const fetchData = useFetchData();

    const jobTitles = useStore.useRecruiterJobTitles();
    const resetData = useStore.useResetAllData();

    useEffect(() => {
        resetData();
        fetchData();
    }, []);

    const handleUpdateInterview = async (jobId: number, candidateId: number, date: string, link: string) => {
        try {
            await useUpdateInterview(jobId, candidateId, date, link);
        } catch (error) {
            console.error("Failed to update interview:", error);
        }
    };

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [meetingLink, setMeetingLink] = useState("");
    const [currentJobId, setCurrentJobId] = useState<number | null>(null);
    const [currentSeekerId, setCurrentSeekerId] = useState<number | null>(null);

    const openEditModal = (row: Interviews) => {
        setCurrentJobId(row.jobId);
        setCurrentSeekerId(row.userId);
        setSelectedDate(row.date ? new Date(row.date) : null);
        setMeetingLink(row.meetingLink || "");
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (currentJobId && currentSeekerId) {
            const utcDate = selectedDate ? new Date(
                Date.UTC(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    selectedDate.getHours(),
                    selectedDate.getMinutes(),
                    selectedDate.getSeconds()
                )
            ).toISOString() : "";

            handleUpdateInterview(currentJobId, currentSeekerId, utcDate, meetingLink);
            setIsModalOpen(false);
            resetModal();
        }
    };

    const resetModal = () => {
        setSelectedDate(null);
        setMeetingLink("");
        setCurrentJobId(null);
        setCurrentSeekerId(null);
    };

    const columns: ColumnDef<Interviews>[] = [
        {
            key: "userName",
            header: "User Name",
            render: (row) => (
                <Link
                    to={`/seeker/${row.userId}`}
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
                    to={`/job/${row.jobId}`}
                    className="text-blue-600 hover:underline"
                >
                    {row.jobTitle}
                </Link>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (row) => {
                if (!row.date) return <span className="text-gray-400">Not scheduled</span>;

                const date = new Date(row.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                return (
                    <div className="flex flex-col">
                        <span>{formattedDate}</span>
                        <span className="text-md text-gray-500">
                            {formattedTime}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "location",
            header: "Job Location",
            render: (row) => (
                <span className="text-gray-600">
                    {row.jobCountry},{row.jobCity}
                </span>
            ),
        },
        {
            key: "candidateLocation",
            header: "Candidate Location",
            render: (row) => (
                <span className="text-gray-600">
                    {row.candidateCountry}, {row.candidateCity}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => openEditModal(row)}
                        className="px-4 py-1 rounded-full bg-black text-white hover:bg-white hover:text-black border border-black transition-colors duration-200"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => window.open(row.meetingLink, '_blank')}
                        className={`px-4 py-1 rounded-full bg-black text-white hover:bg-white hover:text-black border border-black transition-colors duration-200 ${!row.meetingLink ? 'opacity-50 pointer-events-none' : ''
                            }`}
                        disabled={!row.meetingLink}
                    >
                        Join Interview
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

            {/* Edit Interview Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Interview Details</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Date & Time
                            </label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={setSelectedDate}
                                showTimeSelect
                                timeFormat="h:mm aa"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Time"
                                className="border rounded p-2 w-full"
                                placeholderText="Select date and time"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Link
                            </label>
                            <input
                                type="text"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="Enter meeting link (e.g., https://meet.google.com/abc-xyz)"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetModal();
                                }}
                                className="px-4 py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="px-4 py-2"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;