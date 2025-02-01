import { useEffect, useRef } from "react";
import JobCard from "./JobCard";
import useJobStore from "../../stores/useJobStore";

interface JobListProps {
  onJobSelect?: (jobId: number) => void;
}

const JobList = ({ onJobSelect }: JobListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { jobs, hasMore, isLoading, loadMoreJobs } = useJobStore();

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreJobs();
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
  }, [hasMore, isLoading, loadMoreJobs]);

  return (
    <div
      ref={listContainerRef}
      className="h-[800px] overflow-y-scroll space-y-6 bg-white p-4 rounded-3xl custom-scrollbar max-w-[500px]
    border-2 border-gray-200"
    >
      {jobs.map((job, index) => (
        <JobCard
          key={`${job.company}-${job.datePosted}-${index}`}
          {...job}
          onClick={() => onJobSelect?.(index)}
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
    </div>
  );
};

export default JobList;
