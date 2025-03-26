import { Link } from "react-router-dom";
import { Review } from "../../types/review";
import { Star, Edit, Trash2 } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
  removeReview?: (id: number) => Promise<void>;
  updateReview?: (review: Review) => Promise<void>;
}

const ReviewCard = ({
  review: { id, role, createdAt, rating, description, companyData },
  removeReview,
  updateReview,
}: ReviewCardProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-gray-100 p-4 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">
          {role}
          {companyData ? " - " : ""}
          {companyData && (
            <Link
              to={"/company/profile"}
              className="hover:underline hover:underline-offset-2 text-blue-600"
            >
              {companyData.name}
            </Link>
          )}
        </h4>

        {/* Date and Actions Container */}
        <div className="flex items-center gap-4 ml-auto pl-4">
          <span className="text-gray-600 whitespace-nowrap mr-2">{createdAt}</span>

          {removeReview && updateReview && (
            <div className="flex gap-4">
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsFormOpen(true)}
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => removeReview(id)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 mb-2">
        {[...Array(Math.floor(rating))].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-800 break-words">{description}</p>

      {removeReview && updateReview && (
        <ReviewForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          review={{ id, role, rating, description, createdAt }}
          updateReview={updateReview}
        />
      )}
    </div>
  );
};

export default ReviewCard;
