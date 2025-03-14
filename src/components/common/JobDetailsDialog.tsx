import { Dialog, DialogPanel } from "@headlessui/react";
import { JobDetails as JobDetailsType } from "../../types/job";
import JobDetails from "../Job Seeker-For You/JobDetails";
import { useEffect, useState } from "react";
import { mockDetailedJobs } from "../../mock data/jobs";

interface JobDetailsDialogProps {
  useIsOpen: () => boolean;
  useSetIsOpen: (value: boolean) => void;
  useSelectedJobId: () => number | null;
}

const JobDetailsDialog = ({
  useIsOpen,
  useSetIsOpen,
  useSelectedJobId
}: JobDetailsDialogProps) => {
    const [ useDetailedjob, setUseDetailedjob ] = useState<JobDetailsType | null>(null);
    const [ useIsDetailsLoading, setUseIsDetailsLoading ] = useState(false);

    const isOpen = useIsOpen();
    const onClose = () => useSetIsOpen(false);
    const jobId = useSelectedJobId();

    const useSetDetailedJob = () => {
        try {
            setUseIsDetailsLoading(true);
            setTimeout(() => {
              setUseDetailedjob(jobId? mockDetailedJobs[jobId]: {} as JobDetailsType);
              setUseIsDetailsLoading(false);
            }, 1000);
        } catch(error) {
            setUseIsDetailsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen)
          useSetDetailedJob();
    }, [isOpen]);
    
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      
      <div className="fixed inset-0 flex items-center justify-center p-4 ">
        <DialogPanel className="mx-auto max-w-3xl mx-h-[700px] w-full bg-transparent rounded-3xl flex flex-col"> 
          <JobDetails
            useDetailedjobs={() => useDetailedjob}
            useIsDetailsLoading={() => useIsDetailsLoading}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default JobDetailsDialog;