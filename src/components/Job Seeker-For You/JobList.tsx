import { useEffect, useRef } from "react";
import JobCard from "./JobCard";
import { Job } from "../../types/job";

interface BaseJobListProps {
  useJobs: () => Job[];
  useHasMore: () => boolean;
  useIsLoading: () => boolean;
  useFetchJobs: () => () => Promise<void>;
  useSelectedJobId: () => number | null;
  useSetSelectedJobId: () => (id: number) => Promise<void>;
}

interface JobListPropsWithRemoveRecommendation extends BaseJobListProps {
  editJob?: never;
  useDeleteJob?: never;
  useRemoveRecommendation: () => (id: number) => Promise<void>;
}

interface JobListPropsWithEditDelete extends BaseJobListProps {
  editJob: (jobId: number) => void;
  useDeleteJob: () => (id: number) => Promise<void>;
  useRemoveRecommendation?: never;
}

interface JobListPropsWithNoActions extends BaseJobListProps {
  editJob?: never;
  useDeleteJob?: never;
  useRemoveRecommendation?: never;
}

type JobListProps =
  | JobListPropsWithRemoveRecommendation
  | JobListPropsWithEditDelete
  | JobListPropsWithNoActions;

const JobList = ({
  useJobs,
  useHasMore,
  useIsLoading,
  useFetchJobs,
  useSelectedJobId,
  useSetSelectedJobId,
  useRemoveRecommendation,
  editJob,
  useDeleteJob,
}: JobListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const jobs = useJobs();
  const hasMore = useHasMore();
  const isLoading = useIsLoading();
  const fetchJobs = useFetchJobs();

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchJobs();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoading]);

  return (
    <>
      {jobs.length === 0 && !isLoading ? (
        <div className="text-center py-4 text-gray-500">No jobs found.</div>
      ) : (
        <>
          {jobs.map((job) => {
            if (editJob && useDeleteJob) {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  useSelectedJobId={useSelectedJobId}
                  useSetSelectedJobId={useSetSelectedJobId}
                  useDeleteJob={useDeleteJob}
                  editJob={editJob}
                />
              );
            } else if (useRemoveRecommendation) {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  useSelectedJobId={useSelectedJobId}
                  useSetSelectedJobId={useSetSelectedJobId}
                  useRemoveRecommendation={useRemoveRecommendation}
                />
              );
            }
            return (
              <JobCard
                key={job.id}
                job={job}
                useSelectedJobId={useSelectedJobId}
                useSetSelectedJobId={useSetSelectedJobId}
              />
            );
          })}

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center pt-4 text-gray-500">
              No more jobs to show
            </div>
          )}

          <div ref={observerTarget} className="h-2" />
        </>
      )}
    </>
  );
};

export default JobList;