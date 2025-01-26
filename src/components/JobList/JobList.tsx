import { useEffect, useRef} from "react";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Array<{
    company: string;
    rating: number;
    position: string;
    location: string;
  }>;
  onJobSelect?: (jobId: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const JobList = ({
  jobs,
  onJobSelect,
  onLoadMore,
  hasMore,
  isLoading,
}: JobListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="h-[700px] overflow-y-auto space-y-6 bg-white p-6 rounded-3xl">
      {jobs.map((job, index) => (
        <JobCard
          key={`${job.company}-${index}`}
          {...job}
          onClick={() => onJobSelect?.(index)}
        />
      ))}

      <div ref={observerTarget} className="h-2" />

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
    </div>
  );
};

export default JobList;
