import JobList from "./JobList";
import JobDetails from "./JobDetails";
import FilterDropdown from "../Filters/FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import Button from "../common/Button";
import useStore from "../../stores/globalStore";
import { dateOptions, ratingOptions } from "../../data/filterOptions";
import { HomePageTabs } from "../../stores/Seeker Home Slices/homePageSlice";
import { useCallback } from "react";

const ForYou = () => {
  const filters = useStore.useForYouTabFilters();
  const setFilters = useStore.useForYouTabSetFilters();
  const industryOptions = useStore.useSharedEntitiesIndustryOptions();
  const useIsDetailsLoading = useStore.useForYouTabIsDetailsLoading;
  const useDetailedjobs = useStore.useForYouTabDetailedJobs;
  const useJobs = useStore.useForYouTabJobs;
  const useHasMore = useStore.useForYouTabHasMore;
  const useIsLoading = useStore.useForYouTabIsJobsLoading;
  const useFetchJobs = useStore.useForYouTabFetchJobs;
  const useSelectedJobId = useStore.useForYouTabSelectedJobId;
  const useSetSelectedJobId = useStore.useForYouTabSetSelectedJobId;
  const usePushToDetailedJobs = useStore.useForYouTabPushToDetailedJobs;
  const usePopFromDetailedJobs = useStore.useForYouTabPopFromDetailedJobs;
  const useRemoveRecommendation = useStore.useForYouTabRemoveRecommendation;
  const useApplyToJob = useStore.useForYouTabApplyToJob;
  const useReportJob = useStore.useForYouTabReportJob;
  const useFetchCompanyIndustries = useStore.useForYouTabFetchCompanyIndustries;
  const activeTab = useStore.useHomePageActiveTab();

  return (
    <>
      <div className="flex mb-8 items-center gap-14 flex-nowrap">
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

        <LocationSearch
          selectedCountry={filters.country}
          onCountryChange={useCallback((value) => setFilters({ country: value, city: "" }), [])}
          selectedCity={filters.city}
          onCityChange={useCallback((value) => setFilters({ city: value }), [])}
        />
        
        <Button
          variant={filters.remote ? "currentTab" : "outline"}
          className="h-7 text-sm !w-auto"
          onClick={() => setFilters({ remote: !filters.remote })}
        >
          Remote
        </Button>
      </div>

      <div className="grid grid-cols-[1.2fr_1.8fr] gap-10">
        <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 shadow">
          <div className="h-[660px] overflow-y-auto space-y-6 p-3">
            {activeTab === HomePageTabs.ForYou ? (
              <JobList
                useFetchJobs={useFetchJobs}
                useHasMore={useHasMore}
                useIsLoading={useIsLoading}
                useJobs={useJobs}
                useSelectedJobId={useSelectedJobId}
                useSetSelectedJobId={useSetSelectedJobId}
                useRemoveRecommendation={useRemoveRecommendation}
              />
            ) : (
              <JobList
                useFetchJobs={useFetchJobs}
                useHasMore={useHasMore}
                useIsLoading={useIsLoading}
                useJobs={useJobs}
                useSelectedJobId={useSelectedJobId}
                useSetSelectedJobId={useSetSelectedJobId}
              />
            )}
          </div>
        </div>
        <JobDetails
          useDetailedjobs={useDetailedjobs}
          useIsDetailsLoading={useIsDetailsLoading}
          usePushToDetailedJobs={usePushToDetailedJobs}
          usePopFromDetailedJobs={usePopFromDetailedJobs}
          useApplyToJob={useApplyToJob}
          useReportJob={useReportJob}
          useFetchCompanyIndustries={useFetchCompanyIndustries}
        />
      </div>
    </>
  );
};

export default ForYou;
