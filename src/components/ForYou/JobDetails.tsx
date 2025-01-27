import JobCard from "./JobCard";

interface JobDetailsProps {
  job: {
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
  return (
    <div>
      <JobCard {...job} isDetailed={true} />
    </div>
  );
};

export default JobDetails;
