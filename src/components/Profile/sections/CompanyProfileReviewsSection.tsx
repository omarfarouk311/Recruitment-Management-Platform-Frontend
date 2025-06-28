import useStore from "../../../stores/globalStore";
import { useEffect } from "react";
import ReviewList from "../../Review/ReviewList";
import FilterDropdown from "../../Filters/FilterDropdown";
import { sortByDateOptions, reviewsRatingOptions } from "../../../data/filterOptions";
import { useParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import ReviewForm from "../../Review/ReviewForm";
import { useState } from "react";
import { UserRole } from "../../../stores/User Slices/userSlice";

export default function ReviewsSection() {
  const reviews = useStore.useCompanyProfileReviews();
  const hasMore = useStore.useCompanyProfileReviewsHasMore();
  const isLoading = useStore.useCompanyProfileReviewsIsLoading();
  const fetchReviews = useStore.useCompanyProfileFetchReviews();
  const filters = useStore.useCompanyProfileReviewsFilters();
  const setFilters = useStore.useCompanyProfileSetReviewsFilters();
  const { id } = useParams();
  const addReview = useStore.useCompanyProfileAddReview();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userRole = useStore.useUserRole();

  useEffect(() => {
    fetchReviews(id);
  }, [id]);

  return (
    <div className="p-6 bg-white rounded-3xl shadow border-2 border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex gap-14">
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
          <button
            hidden={userRole !== UserRole.SEEKER}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-black"
            title="Add a review"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircle size={30} />
          </button>
        </div>
      </div>
      <div className="mt-8">
        <ReviewList reviews={reviews} hasMore={hasMore} isLoading={isLoading} onLoadMore={fetchReviews} />
      </div>

      {userRole === UserRole.SEEKER && (
        <ReviewForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          addReview={addReview}
          companyId={parseInt(id!)}
        />
      )}
    </div>
  );
}
