import useStore from "../../../stores/globalStore";
import { useEffect } from "react";
import ReviewList from "../../Review/ReviewList";
import FilterDropdown from "../../Filters/FilterDropdown";
import { sortByDateOptions, reviewsRatingOptions } from "../../../data/filterOptions";
import { mockReviews } from "../../../mock data/seekerProfile";

export default function ReviewsSection() {
  const reviews = useStore.useCompanyProfileReviews();
  const hasMore = useStore.useCompanyProfileReviewsHasMore();
  const isLoading = useStore.useCompanyProfileReviewsIsLoading();
  const fetchReviews = useStore.useCompanyProfileFetchReviews();
  const filters = useStore.useCompanyProfileReviewsFilters();
  const setFilters = useStore.useCompanyProfileSetReviewsFilters();

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6 bg-white rounded-3xl shadow border-2 border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <div className="flex space-x-12">
          <FilterDropdown
            label="Sort By Date"
            options={sortByDateOptions}
            selectedValue={filters.sortByDate}
            onSelect={(value) => setFilters({ sortByDate: value })}
          />
          <FilterDropdown
            label="Job Title"
            options={reviewsRatingOptions}
            selectedValue={filters.rating}
            onSelect={(value) => setFilters({ rating: value })}
          />
        </div>
      </div>
      <div className="mt-8">
        <ReviewList
          reviews={reviews}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={fetchReviews}
        />
      </div>
    </div>
  );
}
