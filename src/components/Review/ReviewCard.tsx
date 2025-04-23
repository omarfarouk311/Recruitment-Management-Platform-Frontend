import { Link } from "react-router-dom";
import { Review } from "../../types/review";
import { Star, Edit, Trash2, Dot } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { useState } from "react";
import useStore from "../../stores/globalStore";
import { UserRole } from "../../stores/User Slices/userSlice";

interface ReviewCardProps {
  review: Review;
  removeReview?: (id: number) => Promise<void>;
  updateReview?: (review: Review) => Promise<void>;
}

const ReviewCard = ({
  review: { id, role, createdAt, rating, description, companyData, title },
  removeReview,
  updateReview,
}: ReviewCardProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userRole = useStore.useUserRole();
  const redirect =
    userRole === UserRole.COMPANY
      ? "/company/profile"
      : userRole === UserRole.SEEKER
      ? `/seeker/companies/${companyData?.id}`
      : `/recruiter/companies/${companyData?.id}`;

  return (
    <div className="bg-gray-100 p-4 rounded-3xl shadow border-2 border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium flex items-center space-x-2">
          {title}
          {companyData && (
            <div className="flex items-center space-x-1">
              <Dot className="inline mx-1" />
              <Link
                to={redirect}
                className="hover:underline hover:underline-offset-2 text-blue-600"
              >
                {companyData.name}
              </Link>
              <Dot className="inline mx-1" />
              {[...Array(Math.floor(rating))].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
            </div>
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
              <button onClick={() => removeReview(id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 -mt-2 mb-2">{role}</div>

      <p className="text-gray-800 break-words">{description}</p>

      {removeReview && updateReview && (
        <ReviewForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          review={{ id, role, rating, description, createdAt, title }}
          updateReview={updateReview}
        />
      )}
    </div>
  );
};

export default ReviewCard;
