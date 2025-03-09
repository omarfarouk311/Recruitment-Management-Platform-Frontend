import JobList from "./JobList";
import JobDetails from "./JobDetails";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import {
  dateOptions,
  industryOptions,
  ratingOptions,
} from "../../data/filterOptions";

const ForYou = () => {
  const filters = useStore.useForYouTabFilters();
  const setFilters = useStore.useForYouTabSetFilters();
  const useIsDetailsLoading = useStore.useForYouTabIsDetailsLoading;
  const useDetailedjob = useStore.useForYouTabDetailedJob;
  const useJobs = useStore.useForYouTabJobs;
  const useHasMore = useStore.useForYouTabHasMore;
  const useIsLoading = useStore.useForYouTabIsJobsLoading;
  const useFetchJobs = useStore.useForYouTabFetchJobs;
  const useSelectedJobId = useStore.useForYouTabSelectedJobId;
  const useSetSelectedJobId = useStore.useForYouTabSetSelectedJobId;

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
          className="h-7 text-sm !w-auto"
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
        <JobList
          useFetchJobs={useFetchJobs}
          useHasMore={useHasMore}
          useIsLoading={useIsLoading}
          useJobs={useJobs}
          useSelectedJobId={useSelectedJobId}
          useSetSelectedJobId={useSetSelectedJobId}
        />
        <div className="sticky top-4">
          <JobDetails
            useDetailedjob={useDetailedjob}
            useIsDetailsLoading={useIsDetailsLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ForYou;
