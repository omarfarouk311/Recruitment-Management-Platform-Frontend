import type { JobDetails } from "../../types/job";
import { Star, ExternalLink, Dot, MoveLeft } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import JobDialog from "./JobDialog";
import { useState, useEffect, useRef } from "react";
import JobCard from "./JobCard";
import ReviewCard from "../Review/ReviewCard";
import InfoDialog from "../common/InfoDialog";
import useStore from "../../stores/globalStore";
import { UserRole } from "../../stores/User Slices/userSlice";
import { CV } from "../../types/CV";
import config from "../../../config/config";
import axios from "axios";
import { authRefreshToken } from "../../util/authUtils";
import { showErrorToast } from "../../util/errorHandler";

interface JobDetailsProps {
  useDetailedjobs: () => JobDetails[];
  useIsDetailsLoading: () => boolean;
  usePushToDetailedJobs: () => (id: number) => Promise<void>;
  usePopFromDetailedJobs: () => () => void;
  useApplyToJob: () => (id: number, cvId: number) => Promise<void>;
  useReportJob: () => (id: number, title: string, message: string) => Promise<void>;
  useFetchCompanyIndustries: () => (companyId: number, jobId: number) => Promise<void>;
}

const JobDetails = ({
  useDetailedjobs,
  useIsDetailsLoading,
  usePushToDetailedJobs,
  usePopFromDetailedJobs,
  useApplyToJob,
  useReportJob,
  useFetchCompanyIndustries,
}: JobDetailsProps) => {
  const [imageError, setImageError] = useState(false);
  const [dialogType, setDialogType] = useState<"apply" | "report" | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const jobs = useDetailedjobs();
  const job = jobs[0];
  const isDetailsLoading = useIsDetailsLoading();
  const popFromDetailedJobs = usePopFromDetailedJobs();
  const applyToJob = useApplyToJob();
  const reportJob = useReportJob();
  const fetchCompanyIndustries = useFetchCompanyIndustries();
  const userRole = useStore.useUserRole();
  const [cvs, useSetCvs] = useState<CV[]>([]);

  // Reset image error when image changes
  useEffect(() => {
    setImageError(false);
  }, [job?.companyData.image]); // Use optional chaining

  // Scroll effect
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [jobs]);

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
    id,
    title,
    description,
    city,
    country,
    applicantsCount,
    jobSkillsCount,
    matchingSkillsCount,
    datePosted,
    remote,
    applied,
    reported,
    companyData: {
      id: companyId,
      image,
      type,
      foundedIn,
      industriesCount,
      name,
      rating,
      size,
      industries,
    },
    companyReviews,
    similarJobs,
  } = job;

  const handleApply = async () => {
    try {
      let res;
      try {
        res = await axios.get(`${config.API_BASE_URL}/seekers/cvs/job/${id}`);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          await authRefreshToken();
          res = await axios.get(`${config.API_BASE_URL}/seekers/cvs/job/${job.id}`);
        } else {
          throw err;
        }
      }

      useSetCvs([...res.data.cvs]);
      setDialogType("apply");
    } catch (err) {
      showErrorToast("Something went wrong!");
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white p-6 rounded-3xl h-[700px] overflow-y-auto hide-scrollbar max-w-3xl border-2 border-gray-200"
    >
      {jobs.length > 1 && (
        <div>
          <button
            title="Back"
            className="mb-4 -mt-4 -ml-2 hover:bg-gray-200 rounded-full p-2 transition-colors"
            onClick={popFromDetailedJobs}
          >
            <MoveLeft />
          </button>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {!imageError ? (
              <img src={image} onError={() => setImageError(true)} alt="Profile" />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xl text-gray-500">{name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">{name}</h2>
              <Link to={`/seeker/companies/${companyId}`} className="px-2">
                <ExternalLink className="w-5 h-6 cursor-pointer text-blue-600" />
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
              {datePosted}
            </div>

            <div className="flex space-x-3 mt-2">
              <div className="bg-gray-200 rounded-3xl px-3 py-1 text-sm font-semibold">
                {applicantsCount} applicants
              </div>
              <div className="bg-gray-200 rounded-3xl px-3 py-1 text-sm font-semibold">
                {`${matchingSkillsCount} of ${jobSkillsCount} ${
                  jobSkillsCount > 1 ? "skills" : "skill"
                } match`}
              </div>
              <div>
                <div className="bg-gray-200 rounded-3xl px-3 py-1 text-sm font-semibold">
                  {remote ? "Remote" : "On-site"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {userRole === UserRole.SEEKER && (
          <div className="space-y-4 w-40">
            {applied ? (
              <Button className="h-8" disabled={true} variant="outline">
                Already Applied
              </Button>
            ) : (
              <Button className="h-8" onClick={handleApply}>
                Apply
              </Button>
            )}
            {reported ? (
              <Button variant="outline" className="h-8" disabled={true}>
                Already Reported
              </Button>
            ) : (
              <Button variant="report" className="h-8" onClick={() => setDialogType("report")}>
                Report
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-black whitespace-pre-line break-words">{description}</p>
      </div>

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

          <div className="grid grid-cols-[52px_1fr]">
            <h4 className="font-medium">Type</h4>
            <p>{type}</p>
          </div>

          <div className="grid grid-cols-[10px_1fr]">
            <h4 className="font-medium">Industries</h4>
            <button
              className="text-blue-600 hover:underline cursor-pointer underline-offset-2"
              title="View industries"
              onClick={() => {
                setIsOpen(true);
                fetchCompanyIndustries(companyId, id);
              }}
            >
              {industriesCount} {industriesCount > 1 ? "Industries" : "Industry"}
            </button>
          </div>
        </div>
      </div>

      {companyReviews.length > 0 && (
        <div className="mb-6 pt-1 relative">
          {/* Full-width border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-black -mx-6" />

          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold mb-4 pt-4">Reviews</h3>
          </div>

          <div className="space-y-4">
            {companyReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {similarJobs.length > 0 && (
        <div className="mb-6 pt-1 relative">
          {/* Full-width border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-black -mx-6" />

          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold mb-6 pt-4">Similar Jobs</h3>
          </div>

          <div className="space-y-4 !w-[500px] mx-auto">
            {similarJobs.map((job) => (
              <JobCard key={job.id} job={job} usePushToJobDetails={usePushToDetailedJobs} />
            ))}
          </div>
        </div>
      )}

      <JobDialog
        type={dialogType}
        cvs={cvs}
        onClose={() => setDialogType(null)}
        onApplySubmit={(cvId) => applyToJob(id, cvId)}
        onReportSubmit={(title, message) => reportJob(id, title, message)}
      />

      <InfoDialog
        header={`${name} Industries`}
        isOpen={isOpen}
        data={industries}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default JobDetails;
