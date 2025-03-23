import useStore from "../../../stores/globalStore";
import { useEffect, useRef } from "react";
import ReviewCard from "../../common/Review";

export default function ReviewsSection() {
  const observerTarget = useRef<HTMLDivElement>(null);
  const reviews = useStore.useSeekerProfileReviews();
  const hasMore = useStore.useSeekerProfileReviewsHasMore();
  const isLoading = useStore.useSeekerProfileReviewsIsLoading();
  const fetchReviews = useStore.useSeekerProfileFetchReviews();

  useEffect(() => {
    fetchReviews();
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchReviews();
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
    <div className="bg-white rounded-3xl shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {reviews.length === 0 && !isLoading ? (
            <div className="text-center py-4 text-gray-500">
              No reviews found.
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <div className="px-2" key={review.id}>
                  <ReviewCard key={review.id} review={review} />
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
              {!hasMore && (
                <div className="text-center pt-4 text-gray-500">
                  No more reviews to show
                </div>
              )}
              <div ref={observerTarget} className="h-2" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
