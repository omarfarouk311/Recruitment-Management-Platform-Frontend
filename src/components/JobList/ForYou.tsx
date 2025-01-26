import { useState } from "react";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import FilterBar from "../Filters/FilterBar";

const baseJobs = Array(6)
  .fill({})
  .map((_, index) => ({
    company: `Microsoft ${index + 1}`,
    rating: 4.5,
    position: "Software Engineer II",
    location: "Cairo, Egypt",
  }));

const baseDetailedJob = {
  company: "Microsoft",
  rating: 4.5,
  position: "Software Engineer II",
  location: "Cairo, Egypt",
  description:
    "Are you ready to shape the digital future of the cloud? Join the Microsoft Azure Network Manager team and be at the forefront of innovation in the world of cloud technology. As a Software Engineer II on this team, you'll have the unique opportunity to architect, build, and deliver a seamless, reliable, and high-performance cloud infrastructure.",
  companyDetails: {
    size: "18000 Employees",
    founded: "1975",
    type: "Public",
    industry: "Information Technology",
  },
  review: {
    title: "Current software engineer",
    date: "Dec 2, 2024",
    rating: 4,
    content:
      "Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits such as childcare support, commuter allowances, and employee discounts.",
  },
};

const ForYouPage = () => {
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [jobs, setJobs] = useState(baseJobs);
  const [hasMore, setHasMore] = useState(true);

  const handleJobSelect = (index: number) => {
    setIsDetailsLoading(true);
    setSelectedJobIndex(index);

    setTimeout(() => {
      setIsDetailsLoading(false);
    }, 1000);
  };

  const loadMoreJobs = () => {
    if (!hasMore || isJobsLoading) return;

    setIsJobsLoading(true);

    setTimeout(() => {
      const newJobs = Array(5)
        .fill({})
        .map((_, i) => ({
          company: `Microsoft ${jobs.length + i + 1}`,
          rating: 4.5,
          position: "Software Engineer II",
          location: "Cairo, Egypt",
        }));

      setJobs((prev) => [...prev, ...newJobs]);
      setHasMore(jobs.length + newJobs.length < 20);
      setIsJobsLoading(false);
    }, 1500);
  };

  const getDetailedJob = () => {
    if (selectedJobIndex === null) return baseDetailedJob;

    return {
      ...baseDetailedJob,
      company: jobs[selectedJobIndex].company,
    };
  };

  return (
    <>
      <div className="mb-8">
        <FilterBar />
      </div>
      <div className="grid grid-cols-2 gap-10">
        <JobList
          jobs={jobs}
          onJobSelect={handleJobSelect}
          onLoadMore={loadMoreJobs}
          hasMore={hasMore}
          isLoading={isJobsLoading}
        />

        <div className="sticky top-4 h-min">
          {isDetailsLoading ? (
            <div className="bg-white p-6 rounded-3xl animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mt-4"></div>
            </div>
          ) : (
            <JobDetails job={getDetailedJob()} />
          )}
        </div>
      </div>
    </>
  );
};

export default ForYouPage;
