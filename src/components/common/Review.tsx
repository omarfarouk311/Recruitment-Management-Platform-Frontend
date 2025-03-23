import { Review } from "../../types/review";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({
  review: { role, createdAt, rating, description },
}: ReviewCardProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-3xl">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{role}</h4>
        <span className="text-gray-600">{createdAt}</span>
      </div>
      <div className="flex items-center space-x-1 mb-2">
        {[...Array(Math.floor(rating))].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-800 break-words">{description}</p>
    </div>
  );
};

export default ReviewCard;
