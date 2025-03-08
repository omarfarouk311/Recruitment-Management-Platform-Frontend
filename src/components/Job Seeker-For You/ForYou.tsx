import { useEffect } from "react";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import useStore from "../../stores/GlobalStore";
import {
  dateOptions,
  industryOptions,
  ratingOptions,
} from "../../data/filterOptions";

const ForYou = () => {
  const filters = useStore.useJobsFilters();
  const setFilters = useStore.useSetJobsFilters();
  const fetchJobs = useStore.useFetchJobs();
  const setSelectedJobId = useStore.useSetSelectedJobId();
  const isDetailsLoading = useStore.useIsDetailsLoading();
  const detailedJob = useStore.useDetailedJob();

  // Fetch jobs on initial render and when filters/search criteria change
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <div className="flex mb-8 items-center space-x-6 flex-nowrap">
        <FilterDropdown
          label="Date Posted"
          options={dateOptions}
          selectedValue={filters.datePosted}
          onSelect={(value) => setFilters({ datePosted: value })}
        />

        <FilterDropdown
          label="Company Rating"
          options={ratingOptions}
          selectedValue={filters.companyRating}
          onSelect={(value) => setFilters({ companyRating: value })}
        />

        <FilterDropdown
          label="Industry"
          options={industryOptions}
          selectedValue={filters.industry}
          onSelect={(value) => setFilters({ industry: value })}
        />

        <Button
          variant={filters.remote ? "currentTab" : "outline"}
          className="h-7 text-sm w-auto"
          onClick={() => setFilters({ remote: !filters.remote })}
        >
          Remote
        </Button>

        <LocationSearch
          selectedCountry={filters.country}
          onCountryChange={(value) => setFilters({ country: value, city: "" })}
          selectedCity={filters.city}
          onCityChange={(value) => setFilters({ city: value })}
        />
      </div>

      <div className="grid grid-cols-[1fr_1.7fr] gap-8">
        <JobList onJobSelect={setSelectedJobId} />

        <div className="sticky top-4">
          {isDetailsLoading ? (
            <div className="bg-white p-6 rounded-3xl animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mt-4"></div>
            </div>
          ) : (
            <JobDetails job={detailedJob} />
          )}
        </div>
      </div>
    </>
  );
};

export default ForYou;
