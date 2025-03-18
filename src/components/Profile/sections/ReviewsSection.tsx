import { Star } from 'lucide-react';
import  useStore from '../../../stores/globalStore';
import { useEffect,useState } from 'react';
import SkeletonLoader from '../../common/SkeletonLoader';
import ReviewCard from '../../common/Review';

export default function ReviewsSection() {
  const reviews = useStore.useSeekerProfileReviews();
  const fetchReview = useStore.useSeekerProfileReviewsFetchData();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    fetchReview().then(() => {
      setIsLoading(false);
    });
  }, []);
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <div className="space-y-4">
        {isLoading ? (
            <div className="relative h-[200px] overflow-hidden"> {/* Set your desired max height */}
              <SkeletonLoader />
            </div>
          ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          )))}
        </div>
        <button className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
          Show All reviews
        </button>
      </div>
    </div>
  );
}

