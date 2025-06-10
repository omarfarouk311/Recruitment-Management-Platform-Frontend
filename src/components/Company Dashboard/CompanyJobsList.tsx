import { useEffect } from "react";
import useStore from "../../stores/globalStore";
import JobList from "../Job Seeker-For You/JobList";

interface CompanyJobsListProps {
  editJob: (jobId: number) => void;
}

const CompanyJobsList = ({ editJob }: CompanyJobsListProps) => {
  const useFetchJobs = useStore.useCompanyFetchJobs;
  const fetchJobs = useFetchJobs();
  const useHasMore = useStore.useCompanyJobsHasMore;
  const useIsLoading = useStore.useCompanyJobsIsJobsLoading;
  const useJobs = useStore.useCompanyJobs;
  const useSelectedJobId = useStore.useCompanyTabSelectJobId;
  const useSetSelectedJobId = useStore.useCompanyTabSetSelectedJobId;
  const resetCompanyJobs = useStore.useJobListClear();
  const closeJob = useStore.useCompanyCloseJob;

  useEffect(() => {
    resetCompanyJobs();
    fetchJobs();
  }, []);

  return (
    <JobList
      useFetchJobs={useFetchJobs}
      useHasMore={useHasMore}
      useIsLoading={useIsLoading}
      useJobs={useJobs}
      useSelectedJobId={useSelectedJobId}
      useSetSelectedJobId={useSetSelectedJobId}
      useDeleteJob={closeJob}
      editJob={editJob}
    />
  );
};

export default CompanyJobsList;
