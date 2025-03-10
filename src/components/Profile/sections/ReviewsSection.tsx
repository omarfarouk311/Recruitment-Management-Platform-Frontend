import { Star } from 'lucide-react';
import  useStore from '../../../stores/globalStore';

export default function ReviewsSection() {
  const reviews = useStore.useSeekerProfileReviews();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{review.title}</h3>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900">
          Show All reviews
        </button>
      </div>
    </div>
  );
}