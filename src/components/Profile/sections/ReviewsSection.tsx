import useStore from "../../../stores/globalStore";
import { useEffect } from "react";
import ReviewList from "../../Review/ReviewList";

export default function ReviewsSection() {
  const reviews = useStore.useSeekerProfileReviews();
  const hasMore = useStore.useSeekerProfileReviewsHasMore();
  const isLoading = useStore.useSeekerProfileReviewsIsLoading();
  const fetchReviews = useStore.useSeekerProfileFetchReviews();
  const removeReview = useStore.useSeekerProfileRemoveReview();
  const updateReview = useStore.useSeekerProfileUpdateReview();

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <ReviewList
          reviews={reviews}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={fetchReviews}
          removeReview={removeReview}
          updateReview={updateReview}
        />
      </div>
    </div>
  );
}
