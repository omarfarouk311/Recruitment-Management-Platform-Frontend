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
    review: {
      title: string;
      date: string;
      rating: number;
      content: string;
    };
  };
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return <JobCard {...job} isDetailed={true} />;
};

export default JobDetails;
