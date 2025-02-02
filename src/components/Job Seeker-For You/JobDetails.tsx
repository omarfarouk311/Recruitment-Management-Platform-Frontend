import JobCard from "./JobCard";

interface JobDetailsProps {
  job?: {
    company: string;
    rating: number;
    position: string;
    location: string;
    description: string;
    companyDetails: {
      size: string;
      founded: string;
      type: string;
      industry: string;
    };
    reviews: {
      title: string;
      date: string;
      rating: number;
      content: string;
    }[];
  };
}

const JobDetails = ({ job }: JobDetailsProps) => {
  if (!job) {
    return (
      <div className="bg-white p-6 rounded-3xl h-[800px] flex items-center justify-center border-2 border-gray-200">
        <p className="text-gray-500 text-lg">Select a job to show details</p>
      </div>
    );
  }

  return (
    <div>
      <JobCard {...job} isDetailed={true} />
    </div>
  );
};

export default JobDetails;
