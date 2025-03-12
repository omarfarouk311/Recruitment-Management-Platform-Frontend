import { Star, UserSquare2, Dot } from "lucide-react";
import { Job } from "../../types/job";
import { ThumbsDown } from "lucide-react";

interface BaseJobCardProps {
  job: Job;
  useRemoveRecommendation?: () => (id: number) => Promise<void>;
}

interface SelectionHandlers extends BaseJobCardProps {
  useSelectedJobId: () => number | null;
  useSetSelectedJobId: () => (id: number) => Promise<void>;
  usePushToJobDetails?: never;
}

interface DetailsHandler extends BaseJobCardProps {
  usePushToJobDetails: () => (id: number) => Promise<void>;
  useSelectedJobId?: never;
  useSetSelectedJobId?: never;
}

type JobCardProps = SelectionHandlers | DetailsHandler;

const JobCard = ({
  job: {
    id,
    title,
    country,
    city,
    datePosted,
    companyData: { rating, name, image },
  },
  useSelectedJobId,
  useSetSelectedJobId,
  usePushToJobDetails,
  useRemoveRecommendation,
}: JobCardProps) => {
  const selectedJobId = useSelectedJobId?.();
  const setSelectedJobId = useSetSelectedJobId?.();
  const isSelected = id === selectedJobId;
  const pushToJobDetails = usePushToJobDetails?.();
  const removeRecommendation = useRemoveRecommendation?.();

  return (
    <div
      className={`bg-gray-100 p-4 rounded-3xl mb-4 cursor-pointer hover:bg-gray-200 transition-colors w-full border-2 border-gray ${
        isSelected ? "border-black" : ""
      }`}
      onClick={() =>
        setSelectedJobId
          ? setSelectedJobId(id)
          : pushToJobDetails
          ? pushToJobDetails(id)
          : null
      }
      role="button"
    >
      <div className="relative">
        {removeRecommendation && (
          <button
            className="absolute right-1 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              removeRecommendation(id);
            }}
            title="Remove recommendation"
          >
            <ThumbsDown />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-11 h-11 flex items-center justify-center">
          {image ? <img src={image} /> : <UserSquare2 />}
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
    </div>
  );
};

export default JobCard;
