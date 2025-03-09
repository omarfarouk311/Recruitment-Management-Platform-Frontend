import type { JobDetails } from "../../types/job";
import { formatDistanceToNow } from "date-fns";
import { Star, ExternalLink, UserSquare2, Dot } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import JobDialog from "./JobDialog";
import cvs from "../../mock data/CVs";
import { useState } from "react";
import { ForYouTabSlice } from "../../stores/Seeker Home Slices/forYouTabSlice";

interface JobDetailsProps {
  useDetailedjob: () => ForYouTabSlice["forYouTabDetailedJob"];
  useIsDetailsLoading: () => ForYouTabSlice["forYouTabIsDetailsLoading"];
}

const JobDetails = ({
  useDetailedjob,
  useIsDetailsLoading,
}: JobDetailsProps) => {
  const job = useDetailedjob();
  const isDetailsLoading = useIsDetailsLoading();
  const [dialogType, setDialogType] = useState<"apply" | "report" | null>(null);

  if (isDetailsLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded mt-4"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white p-6 rounded-3xl h-[700px] flex items-center justify-center border-2 border-gray-200">
        <p className="text-gray-500 text-lg">Select a job to show details</p>
      </div>
    );
  }

  const {
    title,
    city,
    country,
    applicantsCount,
    jobSkillsCount,
    matchingSkillsCount,
    datePosted,
    remote,
    companyData: {
      image,
      type,
      foundedIn,
      industriesCount,
      name,
      overview,
      rating,
      size,
    },
    companyReviews,
  } = job;

  return (
    <div className="bg-white p-6 rounded-3xl h-[700px] overflow-y-auto hide-scrollbar max-w-3xl border-2 border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {image ? (
              <img src={image} />
            ) : (
              <UserSquare2 className="w-16 h-16" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">{name}</h2>
              <Link to="/company-profile" className="px-2">
                <ExternalLink className="w-5 h-5 cursor-pointer text-blue-600" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span>{rating}</span>
              <Star className="w-4 h-4 fill-current text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex">
              {country}
              {city ? `, ${city}` : ""}
              <Dot />
              {formatDistanceToNow(new Date(datePosted), { addSuffix: true })}
              <Dot />
              {applicantsCount} applicants
            </div>
          </div>
        </div>
        <div className="space-y-4 w-40">
          <Button className="h-8" onClick={() => setDialogType("apply")}>
            Apply
          </Button>
          <Button
            variant="report"
            className="h-8"
            onClick={() => setDialogType("report")}
          >
            Report
          </Button>
        </div>
      </div>

      {overview && (
        <div className="mb-6">
          <p className="text-black whitespace-pre-line break-words">
            {overview}
          </p>
        </div>
      )}

      <div className="mb-6 pt-4 relative">
        {/* Full-width border line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-black -mx-6" />

        <h3 className="text-lg font-semibold mb-6">Company Overview</h3>
        <div className="grid grid-cols-2 gap-x-32 ml-16 gap-y-6">
          <div className="grid grid-cols-[50px_1fr]">
            <h4 className="font-medium">Size</h4>
            <p>
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
                maximumSignificantDigits: 3,
                signDisplay: "never",
              }).format(size) + " Employees"}
            </p>
          </div>

          <div className="grid grid-cols-[90px_1fr]">
            <h4 className="font-medium">Founded</h4>
            <p>{foundedIn}</p>
          </div>

          <div className="grid grid-cols-[50px_1fr]">
            <h4 className="font-medium">Type</h4>
            <p>{type}</p>
          </div>

          <div className="grid grid-cols-[90px_1fr]">
            <h4 className="font-medium">Industries</h4>
            <p className="text-blue-600">
              {industriesCount}{" "}
              {industriesCount > 1 ? "Industries" : "Industry"}
            </p>
          </div>
        </div>
      </div>

      {companyReviews && companyReviews.length > 0 && (
        <div className="mb-6 pt-1 relative">
          {/* Full-width border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-black -mx-6" />

          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold mb-4 pt-4">Reviews</h3>
            <Link to="/company-profile#reviews" className="px-2">
              <ExternalLink className="w-5 h-5 cursor-pointer text-blue-600" />
            </Link>
          </div>

          <div className="space-y-4">
            {companyReviews.slice(0, 2).map((review, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{review.role}</h4>
                  <span className="text-black">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-800 whitespace-pre-line break-words">
                  {review.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <JobDialog
        type={dialogType}
        cvs={cvs}
        onClose={() => setDialogType(null)}
        onSubmit={(type, data) => {
          if (type === "apply") {
            // Handle application submission API call
          } else {
            // Handle report submission API call
          }
        }}
      />
    </div>
  );
};

export default JobDetails;
