import { StateCreator } from "zustand";
import { CombinedState } from "../storeTypes";
import { Interviews, DashboardInterviewsFilters, updateInterviewDate } from "../../types/recruiterDashboard";
import { mockInterviews } from "../../mock data/recruiterInterviews";

export interface RecruiterInterviewsSlice {
    recruiterInterviewsData: Interviews[];
    recruiterInterviewsPage: number;
    recruiterInterviewsHasMore: boolean;
    recruiterInterviewsIsLoading: boolean;
    recruiterInterviewsFilters: DashboardInterviewsFilters;
    recruiterInterviewsUpateDate: updateInterviewDate;
    recruiterInterviewsSetUpateDate: (date: updateInterviewDate) => Promise<void>;
    recruiterInterviewsFetchData: () => Promise<void>;
    recruiterInterviewsSetFilters: (filters: Partial<RecruiterInterviewsSlice['recruiterInterviewsFilters']>) => void;
}


export const createInterviewsSlice: StateCreator<
    CombinedState,
    [],
    [],
    RecruiterInterviewsSlice
> = (set, get) => ({
    recruiterInterviewsData: [],
    recruiterInterviewsPage: 1,
    recruiterInterviewsHasMore: true,
    recruiterInterviewsIsLoading: false,
    recruiterInterviewsFilters: {
        sortByDate: "", // Sort by Date (Ascending/Descending)
        jobTitle: "",
    },
    recruiterInterviewsUpateDate: {
        jobId: 0,
        date: "",
    },
    recruiterInterviewsSetUpateDate: async ({ jobId, date }) => {
        const { recruiterInterviewsData } = get();
        const updatedData = recruiterInterviewsData.map((interview) => {
            if (interview.jobId === jobId) {
                return { ...interview, date };
            }
            return interview;
        });
        set({ recruiterInterviewsData: updatedData });
    },
    // Fetch data function
    recruiterInterviewsFetchData: async () => {
        const {
            recruiterInterviewsPage,
            recruiterInterviewsHasMore,
            recruiterInterviewsIsLoading,
            recruiterInterviewsFilters,
        } = get();

        // Return early if no more data or already loading
        if (!recruiterInterviewsHasMore || recruiterInterviewsIsLoading) return;

        set({ recruiterInterviewsIsLoading: true });

        try {
            // Simulate API call with a delay
            await new Promise<void>((resolve) =>
                setTimeout(() => {
                    const startIndex = (recruiterInterviewsPage - 1) * 5;
                    const endIndex = startIndex + 5;

                    // Apply filters (if any)
                    const filteredData = mockInterviews.filter((interview) => {
                        if (recruiterInterviewsFilters.jobTitle && interview.jobTitle !== recruiterInterviewsFilters.jobTitle) {
                            return false;
                        }
                        return true;
                    });

                    // Slice the data for pagination
                    const newRows = filteredData.slice(startIndex, endIndex);

                    // Update state with new data
                    set((state) => ({
                        recruiterInterviewsData: [
                            ...state.recruiterInterviewsData,
                            ...newRows.map((interview) => ({
                                ...interview
                            })),
                        ],
                        recruiterInterviewsHasMore:
                            endIndex < filteredData.length,
                        recruiterInterviewsIsLoading: false,
                        recruiterInterviewsPage: state.recruiterInterviewsPage + 1,
                    }));

                    resolve();
                }, 500) // Simulate network delay
            );
        } catch (err) {
            set({ recruiterInterviewsIsLoading: false });
        }
    },

    // Set filters function
    recruiterInterviewsSetFilters: (filters) => {
        set((state) => ({
            recruiterInterviewsFilters: { ...state.recruiterInterviewsFilters, ...filters },
            recruiterInterviewsData: [], // Reset data when filters change
            recruiterInterviewsPage: 1, // Reset pagination
            recruiterInterviewsHasMore: true, // Reset hasMore flag
        }));

        // Fetch new data after updating filters
        get().recruiterInterviewsFetchData();
    },
    
});