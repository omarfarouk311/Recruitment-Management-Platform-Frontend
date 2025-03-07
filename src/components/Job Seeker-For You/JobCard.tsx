import { Star, UserSquare2, Dot } from "lucide-react";
import { Job } from "../../types/job";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobCard = ({
  job: {
    title,
    country,
    city,
    datePosted,
    companyData: { rating, name, image },
  },
  isSelected,
  onClick,
}: JobCardProps) => {
  return (
    <div
      className={`bg-gray-100 p-4 rounded-3xl mb-4 cursor-pointer hover:bg-gray-200 transition-colors w-full border-2 border-gray ${
        isSelected ? "border-black" : ""
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
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
            {formatDistanceToNow(new Date(datePosted), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
