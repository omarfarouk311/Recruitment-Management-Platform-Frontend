import { Dialog, DialogPanel } from "@headlessui/react";
import JobDetails from "../Job Seeker-For You/JobDetails";
import { useEffect, useState } from "react";
import useStore from "../../stores/globalStore";


const JobDetailsDialog = () => {
    const isOpen = useStore.useJobDetailsDialogIsOpen();
    const setIsOpen = useStore.useJobDetailsDialogSetIsOpen();
    const useDetailedjobs = useStore.useForYouTabDetailedJobs;
    const useIsDetailsLoading = useStore.useForYouTabIsDetailsLoading;
    const pushToDetailedJobs = useStore.useForYouTabPushToDetailedJobs();
    const usePopFromDetailedJobs = useStore.useForYouTabPopFromDetailedJobs;
    const useApplyToJob = useStore.useForYouTabApplyToJob;
    const useReportJob = useStore.useForYouTabReportJob;
    const useFetchCompanyIndustries = useStore.useForYouTabFetchCompanyIndustries;
    const clearDetailedJobs = useStore.useForYouTabClearDetailedJobs();
    const selectedJobId = useStore.useJobDetailsDialogSelectedJobId();

    useEffect(() => {
        if (isOpen && selectedJobId) {
            pushToDetailedJobs(selectedJobId);
        }
        if(!isOpen) clearDetailedJobs();
    },[isOpen])

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4 ">
                <DialogPanel className="mx-auto max-w-3xl mx-h-[700px] w-full bg-transparent rounded-3xl flex flex-col">
                    <JobDetails
                        useDetailedjobs={useDetailedjobs}
                        useIsDetailsLoading={useIsDetailsLoading}
                        usePushToDetailedJobs={() => pushToDetailedJobs}
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
