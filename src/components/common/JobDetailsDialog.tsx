import { Dialog, DialogPanel } from "@headlessui/react";
import { JobDetails as JobDetailsType } from "../../types/job";
import JobDetails from "../Job Seeker-For You/JobDetails";
import { useEffect, useState } from "react";
import { mockDetailedJobs } from "../../mock data/seekerForYou";
import { mockCompanyIndustries } from "../../mock data/seekerCompanies";

interface JobDetailsDialogProps {
    useIsOpen: () => boolean;
    useSetIsOpen: (value: boolean) => void;
    useSelectedJobId: () => number | null;
}

const JobDetailsDialog = ({
    useIsOpen,
    useSetIsOpen,
    useSelectedJobId,
}: JobDetailsDialogProps) => {
    const [useDetailedjob, setUseDetailedjob] = useState<JobDetailsType[]>([]);
    const [useIsDetailsLoading, setUseIsDetailsLoading] = useState(false);

    const isOpen = useIsOpen();
    const onClose = () => useSetIsOpen(false);
    const jobId = useSelectedJobId();

    const useSetDetailedJob = () => {
        try {
            setUseIsDetailsLoading(true);
            setTimeout(() => {
                setUseDetailedjob(
                    jobId ? [mockDetailedJobs[jobId]] : [{} as JobDetailsType]
                );
                setUseIsDetailsLoading(false);
            }, 1000);
        } catch (error) {
            setUseIsDetailsLoading(false);
        }
    };

    const ApplyToJob = async (id: number, cvId: number) => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                setUseDetailedjob((state) => 
                    state.map((job) => job.id === id ? { ...job, applied: true } : job)
                )
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    }

    const ReportJob = async (id: number, message: string) => {
        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                setUseDetailedjob((state) => (
                    state.map((job) => job.id === id ? { ...job, reported: true } : job)
                ));
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    }

    const FetchCompanyIndustries = async (id: number) => {
        if (useDetailedjob.find((job) => job.id === id)?.companyData.industries.length) return;

        // mock API call
        try {
            await new Promise<void>((resolve) => setTimeout(() => {
                setUseDetailedjob((state) => (
                    state.map((job: JobDetailsType) => job.id === id ?
                        {
                            ...job,
                            companyData: { ...job.companyData, industries: [...mockCompanyIndustries] },
                            companyReviews: [...job.companyReviews],
                            similarJobs: [...job.similarJobs.map((job) => ({ ...job, companyData: { ...job.companyData } }))]
                        }
                        :
                        {
                            ...job,
                            companyData: { ...job.companyData, industries: [...job.companyData.industries] },
                            companyReviews: [...job.companyReviews],
                            similarJobs: [...job.similarJobs.map((job) => ({ ...job, companyData: { ...job.companyData } }))],
                        }
                    )
                ));
                resolve();
            }, 500));
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (isOpen) useSetDetailedJob();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4 ">
                <DialogPanel className="mx-auto max-w-3xl mx-h-[700px] w-full bg-transparent rounded-3xl flex flex-col">
                    <JobDetails
                        useDetailedjobs={() => useDetailedjob}
                        useIsDetailsLoading={() => useIsDetailsLoading}
                        usePushToDetailedJobs={() => async (id: number) => {
                            const job = mockDetailedJobs[id];
                            setUseDetailedjob([job, ...useDetailedjob]);
                        }}
                        usePopFromDetailedJobs={() => () =>
                            setUseDetailedjob(useDetailedjob.slice(1))}
                        useApplyToJob={() => ApplyToJob}
                        useReportJob={() => ReportJob}
                        useFetchCompanyIndustries={() => FetchCompanyIndustries}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default JobDetailsDialog;
