import { useEffect, useRef } from "react";
import CompanyJobCard from "./CompanyJobCard";
import { Job } from "../../types/job";

interface JobListProps {
    useJobs: () => Job[];
    useHasMore: () => boolean;
    useIsLoading: () => boolean;
    useFetchJobs: () => () => Promise<void>;
    useSelectedJobId: () => number | null;
    useSetSelectedJobId: () => (id: number) => Promise<void>;
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
    }, [isLoading]);

    return (
        <>
            {jobs.length === 0 && !isLoading ? (
                <div className="text-center py-4 text-gray-500">No jobs found.</div>
            ) : (
                <>
                    {jobs.map((job) => (
                        <CompanyJobCard
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
