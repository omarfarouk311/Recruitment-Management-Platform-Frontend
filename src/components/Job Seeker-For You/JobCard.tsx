import { Star, Dot, Edit3, Trash2, Loader } from "lucide-react";
import { Job } from "../../types/job";
import { ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";

interface BaseJobCardProps {
  job: Job;
}

interface BaseSelectionHandlers extends BaseJobCardProps {
  useSelectedJobId: () => number | null;
  useSetSelectedJobId: () => (id: number) => Promise<void>;
  usePushToJobDetails?: never;
}

// Case 1: With edit/delete actions
interface SelectionWithEditDelete extends BaseSelectionHandlers {
  editJob: (jobId: number) => void;
  useDeleteJob: () => (id: number) => Promise<void>;
  useRemoveRecommendation?: never;
}

// Case 2: With remove recommendation
interface SelectionWithRemoveRecommendation extends BaseSelectionHandlers {
  useRemoveRecommendation: () => (id: number) => Promise<void>;
  editJob?: never;
  useDeleteJob?: never;
}

// Case 3: Just base selection handlers without any actions
interface SelectionWithoutActions extends BaseSelectionHandlers {
  editJob?: never;
  useDeleteJob?: never;
  useRemoveRecommendation?: never;
}

interface DetailsHandler extends BaseJobCardProps {
  usePushToJobDetails: () => (id: number) => Promise<void>;
  useSelectedJobId?: never;
  useSetSelectedJobId?: never;
  useRemoveRecommendation?: never;
  editJob?: never;
  useDeleteJob?: never;
}

type JobCardProps =
  | DetailsHandler
  | SelectionWithEditDelete
  | SelectionWithRemoveRecommendation
  | SelectionWithoutActions;

const JobCard = ({
  job: {
    id,
    title,
    country,
    city,
    datePosted,
    companyData: { rating, name, image },
    closed,
  },
  useSelectedJobId,
  useSetSelectedJobId,
  usePushToJobDetails,
  useRemoveRecommendation,
  editJob,
  useDeleteJob,
}: JobCardProps) => {
  const selectedJobId = useSelectedJobId?.();
  const setSelectedJobId = useSetSelectedJobId?.();
  const isSelected = id === selectedJobId;
  const pushToJobDetails = usePushToJobDetails?.();
  const removeRecommendation = useRemoveRecommendation?.();
  const [removing, setRemoving] = useState(false);
  const closeJob = useDeleteJob?.();
  const [imageError, setImageError] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Reset error state when image URL changes
    setImageError(false);
  }, [image]);

  return (
    <div
      className={`bg-gray-100 p-4 rounded-3xl mb-4 cursor-pointer hover:bg-gray-200 shadow transition-colors w-full border-2 border-gray ${
        isSelected ? "border-black" : ""
      }`}
      onClick={() =>
        setSelectedJobId ? setSelectedJobId(id) : pushToJobDetails ? pushToJobDetails(id) : null
      }
      role="button"
    >
      <div className="relative">
        {removeRecommendation && (
          <button
            className="absolute right-1 hover:text-red-500"
            onClick={async (e) => {
              e.stopPropagation();
              setRemoving(true);
              setTimeout(async () => {
                await removeRecommendation(id);
                setRemoving(false);
              }, 500);
            }}
            title="Remove recommendation"
          >
            <ThumbsDown />
          </button>
        )}
      </div>

      {closed ? (
        <div className="relative">
          <div className="absolute right-1 hover:text-blue-500">
            <p className="text-red-600 font-medium">Closed</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {editJob && (
            <button
              className="absolute right-1 hover:text-blue-500"
              onClick={() => editJob(id)}
              title="Edit job"
            >
              <Edit3 />
            </button>
          )}
          {closeJob && (
            <button
              className="absolute right-1 mt-12 hover:text-red-500"
              onClick={async () => {
                setClosing(true);
                await closeJob(id);
                setClosing(false);
              }}
              title="Delete job"
            >
              {closing ? <Loader className="animate-spin" /> : <Trash2 />}
            </button>
          )}
        </div>
      )}

      {removing ? (
        <p className="text-red-500 text-md font-semibold">Job Recommendation removed</p>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 flex items-center justify-center">
            {image && !imageError ? (
              <img src={image} onError={() => setImageError(true)} alt="Profile" />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xl text-gray-500">{name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold">{name}</h2>
              <span>{rating}</span>
              <Star className="w-4 h-4 fill-current text-yellow-400" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex">
              {country}, {city ? " " + city : ""}
              <Dot />
              {datePosted}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
