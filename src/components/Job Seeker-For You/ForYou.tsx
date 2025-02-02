import { useEffect } from "react";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import FilterBar from "../Filters/FilterBar";
import FilterDropdown from "../Filters/FilterDropdown";
import Button from "../common/Button";
import useJobStore from "../../stores/useJobStore";
import { baseDetailedJobs } from "../../mock data/jobs";
import {
  dateOptions,
  industryOptions,
  ratingOptions,
} from "../../data/filterOptions";

const ForYouPage = () => {
  const {
    filters,
    setFilters,
    fetchJobs,
    selectedJobIndex,
    setSelectedJobIndex,
    isDetailsLoading,
    setIsDetailsLoading,
  } = useJobStore();

  // Fetch jobs on initial render and when filters/search criteria change
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle job selection
  const handleJobSelect = (index: number) => {
    setIsDetailsLoading(true);
    setSelectedJobIndex(index);
    setTimeout(() => setIsDetailsLoading(false), 1000);
  };

  // Determine if a job is selected
  const isJobSelected = selectedJobIndex !== null;

  return (
    <>
      <div className="flex mb-8">
        <FilterBar>
          <FilterDropdown
            label="Date Posted"
            options={dateOptions}
            selectedValue={filters.date}
            onSelect={(value) => setFilters({ date: value })}
          />

          <FilterDropdown
            label="Company Rating"
            options={ratingOptions}
            selectedValue={filters.rating}
            onSelect={(value) => setFilters({ rating: value })}
          />

          <FilterDropdown
            label="Industry"
            options={industryOptions}
            selectedValue={filters.industry}
            onSelect={(value) => setFilters({ industry: value })}
          />

          <Button
            variant={filters.remoteOnly ? "currentTab" : "outline"}
            className="h-7 text-sm"
            onClick={() => setFilters({ remoteOnly: !filters.remoteOnly })}
          >
            Remote only
          </Button>
        </FilterBar>
      </div>

      <div className="grid grid-cols-[1fr_1.6fr] gap-8">
        <JobList onJobSelect={handleJobSelect} />

        <div className="sticky top-4">
          {isDetailsLoading ? (
            <div className="bg-white p-6 rounded-3xl animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mt-4"></div>
            </div>
          ) : isJobSelected ? (
            <JobDetails job={baseDetailedJobs[selectedJobIndex]} />
          ) : (
            <JobDetails />
          )}
        </div>
      </div>
    </>
  );
};

export default ForYouPage;
