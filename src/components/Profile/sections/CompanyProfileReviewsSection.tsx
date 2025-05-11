import useStore from "../../../stores/globalStore";
import { useEffect } from "react";
import ReviewList from "../../Review/ReviewList";
import FilterDropdown from "../../Filters/FilterDropdown";
import { sortByDateOptions, reviewsRatingOptions } from "../../../data/filterOptions";
import { useParams } from "react-router-dom";

export default function ReviewsSection() {
  const reviews = useStore.useCompanyProfileReviews();
  const hasMore = useStore.useCompanyProfileReviewsHasMore();
  const isLoading = useStore.useCompanyProfileReviewsIsLoading();
  const fetchReviews = useStore.useCompanyProfileFetchReviews();
  const filters = useStore.useCompanyProfileReviewsFilters();
  const setFilters = useStore.useCompanyProfileSetReviewsFilters();
  const { id } = useParams();

  useEffect(() => {
    fetchReviews(id);
  }, [id]);

  return (
    <div className="p-6 bg-white rounded-3xl shadow border-2 border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <div className="flex space-x-12">
          <FilterDropdown
            label="Sort By Date"
            options={sortByDateOptions}
            selectedValue={filters.sortByDate}
            onSelect={(value) => setFilters({ sortByDate: value }, id)}
          />
          <FilterDropdown
            label="Rating"
            options={reviewsRatingOptions}
            selectedValue={filters.rating}
            onSelect={(value) => setFilters({ rating: value }, id)}
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
