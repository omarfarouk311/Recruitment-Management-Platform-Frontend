import { Dot } from "lucide-react";
import { Job } from "../../types/job";
import { useState, useEffect } from "react";

interface BaseJobCardProps {
    job: Job;
}

interface SelectionHandlers extends BaseJobCardProps {
    useSelectedJobId: () => number | null;
    useSetSelectedJobId: () => (id: number) => Promise<void>;
}

interface DetailsHandler extends BaseJobCardProps {
    useSelectedJobId?: never;
    useSetSelectedJobId?: never;
}

type JobCardProps = SelectionHandlers | DetailsHandler;

const JobCard = ({
    job: { id, title, country, city, datePosted },
    useSelectedJobId,
    useSetSelectedJobId,
}: JobCardProps) => {
    const selectedJobId = useSelectedJobId?.();
    const setSelectedJobId = useSetSelectedJobId?.();
    const isSelected = id === selectedJobId;
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = async () => {
        if (setSelectedJobId) {
            await setSelectedJobId(id);
        }
    };

    return (
        <div
            className={`bg-white p-6 rounded-2xl mb-5 cursor-pointer 
        transition-all duration-300 w-full 
        border-2 shadow-sm hover:shadow-md
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
      `}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
        >
            <div className="flex flex-col space-y-3">
                <h2 className="font-bold text-2xl text-gray-800 tracking-tight">
                    {title}
                </h2>
                <div className="flex items-center text-lg text-gray-600">
                    <span className="font-medium">{country}</span>
                    {city && (
                        <>
                            <span>,&nbsp;</span>
                            <span>{city}</span>
                        </>
                    )}
                    <Dot className="mx-2" size={20} />
                    <span className="text-gray-500">{datePosted}</span>
                </div>
                <div className={`h-1 w-16 mt-2 rounded-full transition-all duration-300 ${isSelected ? "bg-blue-500" : isHovered ? "bg-gray-300" : "bg-gray-200"}`}></div>
            </div>
        </div>
    );
};

export default JobCard;