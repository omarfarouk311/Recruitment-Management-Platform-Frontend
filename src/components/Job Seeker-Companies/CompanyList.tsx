import CompanyCard from "./CompanyCard";
import { CompanyCard as CompanyCardType } from "../../types/company";
import { useEffect, useRef } from "react";

interface CompanyListProps {
  useCompanies: () => CompanyCardType[];
  useHasMore: () => boolean;
  useIsLoading: () => boolean;
  useFetchCompanies: () => () => Promise<void>;
}

const CompanyList = ({
  useCompanies,
  useHasMore,
  useIsLoading,
  useFetchCompanies,
}: CompanyListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const companies = useCompanies();
  const hasMore = useHasMore();
  const isLoading = useIsLoading();
  const fetchCompanies = useFetchCompanies();

  // scrolling logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchCompanies();
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
    <>
      {companies.length === 0 && !isLoading ? (
        <div className="text-center py-4 text-gray-500">
          No companies found.
        </div>
      ) : (
        <>
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!hasMore && (
            <div className="text-center pt-8 text-gray-500">
              No more companies to show
            </div>
          )}
          <div ref={observerTarget} className="h-8" />
        </>
      )}
    </>
  );
};

export default CompanyList;
