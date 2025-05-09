import { useEffect, useRef } from "react";
import ReviewCard from "./ReviewCard";
import { Review } from "../../types/review";

interface BaseReviewListProps {
  reviews: Review[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}
interface ReviewListPropsEditDelete extends BaseReviewListProps {
  removeReview: (id: number) => Promise<void>;
  updateReview: (review: Review) => Promise<void>;
}

interface ReviewListPropsNoActions extends BaseReviewListProps {
  removeReview?: never;
  updateReview?: never;
}

type ReviewListProps = ReviewListPropsEditDelete | ReviewListPropsNoActions;

export default function ReviewList({
  reviews,
  hasMore,
  isLoading,
  removeReview,
  updateReview,
  onLoadMore,
}: ReviewListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
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
    <div className="space-y-6 h-[600px] overflow-y-auto">
      {reviews.length === 0 && !isLoading ? (
        <div className="text-center py-4 text-gray-500">No reviews found.</div>
      ) : (
        <>
          {reviews.map((review) => (
            <div className="px-2" key={review.id}>
              <ReviewCard review={review} removeReview={removeReview} updateReview={updateReview} />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!hasMore && (
            <div className="text-center pt-4 text-gray-500">No more reviews to show</div>
          )}
          <div ref={observerTarget} className="h-2" />
        </>
      )}
    </div>
  );
}
