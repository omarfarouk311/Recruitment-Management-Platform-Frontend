import { useEffect, useRef } from "react";
import JobCard from "./JobCard";
import { ForYouTabSlice } from "../../stores/Seeker Home Slices/forYouTabSlice";

interface JobListProps {
  useJobs: () => ForYouTabSlice["forYouTabJobs"];
  useHasMore: () => ForYouTabSlice["forYouTabHasMore"];
  useIsLoading: () => ForYouTabSlice["forYouTabIsJobsLoading"];
  useFetchJobs: () => ForYouTabSlice["forYouTabFetchJobs"];
  useSelectedJobId: () => ForYouTabSlice["forYouTabSelectedJobId"];
  useSetSelectedJobId: () => ForYouTabSlice["forYouTabSetSelectedJobId"];
}

const JobList = ({
  useJobs,
  useHasMore,
  useIsLoading,
  useFetchJobs,
  useSelectedJobId,
  useSetSelectedJobId,
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
  }, [hasMore, isLoading]);

  return (
    <div
      className="h-[700px] overflow-y-auto space-y-6 bg-white p-4 rounded-3xl hide-scrollbar max-w-[500px]
      border-2 border-gray-200"
    >
      {jobs.length === 0 && !isLoading ? (
        <div className="text-center py-4 text-gray-500">No jobs found.</div>
      ) : (
        <>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              useSelectedJobId={useSelectedJobId}
              useSetSelectedJobId={useSetSelectedJobId}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!hasMore && (
            <div className="text-center py-4 text-gray-500">
              No more jobs to show
            </div>
          )}
          <div ref={observerTarget} className="h-2" />
        </>
      )}
    </div>
  );
};

export default JobList;
