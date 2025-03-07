import type { JobDetails } from "../../types/job";
import { formatDistanceToNow } from "date-fns";
import { Star, ExternalLink, UserSquare2, Dot } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import JobDialog from "./JobDialog";
import cvs from "../../mock data/CVs";
import { useState } from "react";

interface JobDetailsProps {
  job: JobDetails | null;
}

const JobDetails = ({ job }: JobDetailsProps) => {
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

  const [dialogType, setDialogType] = useState<"apply" | "report" | null>(null);

  return (
    <div className="bg-white p-6 rounded-3xl h-[700px] overflow-y-auto hide-scrollbar max-w-3xl border-2 border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {image ? <img src={image} /> : <UserSquare2 className="w-16 h-16"/>}
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

      <div className="mb-6 pt-4 border-t border-black">
        <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Size</h4>
            <p>{size + " Employees"}</p>
          </div>
          <div>
            <h4 className="font-medium">Founded</h4>
            <p>{foundedIn}</p>
          </div>
          <div>
            <h4 className="font-medium">Type</h4>
            <p>{type}</p>
          </div>
          <div>
            <h4 className="font-medium">Industry</h4>
            <p>{industriesCount}</p>
          </div>
        </div>
      </div>

      {companyReviews && companyReviews.length > 0 && (
        <div className="border-t border-black">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold mb-4 pt-4">Reviews</h3>
            <Link
              to="/company-profile#reviews"
              className="ml-2 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </Link>
          </div>

          <div className="space-y-4">
            {companyReviews.slice(0, 2).map((review, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-xl">
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
