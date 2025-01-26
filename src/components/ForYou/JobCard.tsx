import { Star } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface JobCardProps {
  company: string;
  rating: number;
  position: string;
  location: string;
  isDetailed?: boolean;
  description?: string;
  companyDetails?: {
    size: string;
    founded: string;
    type: string;
    industry: string;
  };
  review?: {
    title: string;
    date: string;
    rating: number;
    content: string;
  };
  onClick?: () => void;
}

const JobCard = ({
  company,
  rating,
  position,
  location,
  isDetailed,
  description,
  companyDetails,
  review,
  onClick,
}: JobCardProps) => {
  if (isDetailed) {
    return (
      <div className="bg-white p-6 rounded-3xl bg-white p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <img
                src="https://www.microsoft.com/favicon.ico"
                alt="Microsoft"
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{company}</h2>
                <Link
                  to="/company-profile"
                  className="ml-2 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span>{rating}</span>
                <Star className="w-4 h-4 fill-current text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold">{position}</h3>
              <p>{location}</p>
            </div>
          </div>
          <div className="space-y-5">
            <Button className="border-black w-full bg-black text-white rounded-full w-40 py-1">
              Apply
            </Button>
            <Button variant="report">Report</Button>
          </div>
        </div>

        {description && (
          <div className="mb-6">
            <p className="text-black">{description}</p>
          </div>
        )}

        {companyDetails && (
          <div className="mb-6 pt-4 border-t border-black">
            <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Size</h4>
                <p>{companyDetails.size}</p>
              </div>
              <div>
                <h4 className="font-medium">Founded</h4>
                <p>{companyDetails.founded}</p>
              </div>
              <div>
                <h4 className="font-medium">Type</h4>
                <p>{companyDetails.type}</p>
              </div>
              <div>
                <h4 className="font-medium">Industry</h4>
                <p>{companyDetails.industry}</p>
              </div>
            </div>
          </div>
        )}

        {review && (
          <div className="border-t border-black">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold mb-4 pt-4">Reviews</h3>
              <Link
                to="/company-profile#reviews" //Add anchor ID in the company profile reviews section later
                className="ml-2 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </Link>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{review.title}</h4>
                <span className="text-black">{review.date}</span>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-gray-100 p-4 rounded-3xl mb-4 cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
          <img
            src="https://www.microsoft.com/favicon.ico"
            alt="Microsoft"
            className="w-8 h-8"
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold">{company}</h2>
            <span>{rating}</span>
            <Star className="w-4 h-4 fill-current text-yellow-400" />
          </div>
          <h3 className="font-semibold">{position}</h3>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
