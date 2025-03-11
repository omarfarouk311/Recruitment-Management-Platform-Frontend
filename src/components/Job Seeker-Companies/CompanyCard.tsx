import { Star, ExternalLink, UserSquare2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyCard } from "../../types/company";

interface CompanyCardProps {
  company: CompanyCard;
}

const CompanyCard = ({
  company: {
    name,
    industriesCount,
    jobsCount,
    locationsCount,
    overview,
    rating,
    reviewsCount,
    size,
    image,
  },
}: CompanyCardProps) => {
  return (
    <div className="bg-gray-100 rounded-3xl p-6 space-y-6 border-2 border-gray">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center">
            {image ? <img src={image} /> : <UserSquare2 />}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold">{name}</h3>
              <Link to="/seeker/company-profile" className="px-2">
                <ExternalLink className="w-5 h-6  cursor-pointer text-blue-600" />
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{rating}</span>
              <Star className="h-4 w-4 fill-current text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="flex mx-5 mb-2 space-x-24">
          <div>
            <Link to="/company-profile#reviews">
              <div className="text-xl font-semibold text-blue-500">
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                  maximumSignificantDigits: 3,
                  signDisplay: "never",
                }).format(reviewsCount)}
              </div>
            </Link>
            <div className="text-sm text-black text-center font-semibold">
              Reviews
            </div>
          </div>

          <div>
            <Link to="/company-profile#jobs">
              <div className="text-xl font-semibold text-blue-500">
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  maximumFractionDigits: 1,
                  maximumSignificantDigits: 3,
                  signDisplay: "never",
                }).format(jobsCount)}
              </div>
            </Link>
            <div className="text-sm text-black text-center font-semibold">
              Jobs
            </div>
          </div>
        </div>
      </div>

      <div className="flex mx-8 space-x-44">
        <div>
          <h4 className="text-lg font-semibold mb-1">Locations</h4>
          <p className="text-center text-blue-600">
            {locationsCount} Locations
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-1">Company Size</h4>
          <p className="text-center text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(size)}{" "}
            Employees
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-1">Industries</h4>
          <p className="text-center text-blue-600">
            {industriesCount} {industriesCount > 1 ? "Industries" : "Industry"}
          </p>
        </div>
      </div>

      <p className="text-black">{overview}</p>
    </div>
  );
};

export default CompanyCard;
