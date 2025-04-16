import { Dialog, DialogPanel } from "@headlessui/react";
import JobDetails from "../Job Seeker-For You/JobDetails";
import { useEffect, useState } from "react";
import useStore from "../../stores/globalStore";


interface JobDetailsDialogProps {
    useIsOpen: () => boolean;
    useSetIsOpen: (value: boolean) => void;
}

const JobDetailsDialog = ({
    useIsOpen,
    useSetIsOpen,
}: JobDetailsDialogProps) => {
    const isOpen = useIsOpen();
    const onClose = () => useSetIsOpen(false);
    const useDetailedjobs = useStore.useForYouTabDetailedJobs;
    const useIsDetailsLoading = useStore.useForYouTabIsDetailsLoading;
    const usePushToDetailedJobs = useStore.useForYouTabPushToDetailedJobs;
    const usePopFromDetailedJobs = useStore.useForYouTabPopFromDetailedJobs;
    const useApplyToJob = useStore.useForYouTabApplyToJob;
    const useReportJob = useStore.useForYouTabReportJob;
    const useFetchCompanyIndustries = useStore.useForYouTabFetchCompanyIndustries;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4 ">
                <DialogPanel className="mx-auto max-w-3xl mx-h-[700px] w-full bg-transparent rounded-3xl flex flex-col">
                    <JobDetails
                        useDetailedjobs={useDetailedjobs}
                        useIsDetailsLoading={useIsDetailsLoading}
                        usePushToDetailedJobs={usePushToDetailedJobs}
                        usePopFromDetailedJobs={usePopFromDetailedJobs}
                        useApplyToJob={useApplyToJob}
                        useReportJob={useReportJob}
                        useFetchCompanyIndustries={useFetchCompanyIndustries}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default JobDetailsDialog;
