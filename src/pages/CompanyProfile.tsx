import { CompanyProfileInfo } from "../components/Profile/sections/CompanyProfileInfo";
import UserNav from "../components/Header/UserNav";
import JobList from "../components/Job Seeker-For You/JobList";
import useStore from "../stores/globalStore";
import ReviewsSection from "../components/Profile/sections/CompanyProfileReviewsSection";
import JobDetailsDialog from "../components/common/JobDetailsDialog";
import FilterDropdown from "../components/Filters/FilterDropdown";
import Button from "../components/common/Button";
import { sortByDateOptions } from "../data/filterOptions";
import { useEffect } from "react";
import { mockJobs } from "../mock data/seekerForYou";

export default function CompanyProfile() {
  // const useJobs = useStore.useCompanyProfileJobs;
  const useJobs = () => mockJobs;
  const useJobsHasMore = useStore.useCompanyProfileJobsHasMore;
  const useJobsIsLoading = useStore.useCompanyProfileIsJobsLoading;
  const useSelectedJobId = useStore.useForYouTabSelectedJobId;
  const filters = useStore.useCompanyProfileJobsFilters();
  const setFilters = useStore.useCompanyProfileSetJobsFilters();
  const useIsJobDetailsDialogOpen = useStore.useCompanyProfileIsJobDetailsDialogOpen;
  const useFetchJobs = useStore.useCompanyProfileFetchJobs;
  const useSetSelectedJobId = useStore.useCompanyProfileSetSelectedJobId;
  const setJobDetailsDialogOpen = useStore.useCompanyProfileSetJobDetailsDialogOpen();
  const fetchJobTitlesFilter = useStore.useCompanyProfileFetchJobTitlesFilter();
  const { industries } = useStore.useCompanyProfileInfo();
  const jobTitlesFilter = useStore.useCompanyProfileJobTitlesFilter();
  const clearProfile = useStore.useCompanyProfileClear();

  useEffect(() => {
    fetchJobTitlesFilter();
    return () => {
      clearProfile();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="p-8">
        <CompanyProfileInfo />

        <div className="grid grid-cols-[1fr_1.7fr] gap-8 mt-8">
          <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 shadow">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Jobs</h1>
              <Button
                variant={filters.remote ? "currentTab" : "outline"}
                className="h-7 text-sm !w-auto"
                onClick={() => setFilters({ remote: !filters.remote })}
              >
                Remote
              </Button>
            </div>

            <div className="flex mb-6 items-center justify-between flex-nowrap mt-6">
              <FilterDropdown
                label="Sort By Date"
                options={sortByDateOptions}
                selectedValue={filters.sortByDate}
                onSelect={(value) => setFilters({ sortByDate: value })}
              />

              <FilterDropdown
                label="Job Title"
                options={jobTitlesFilter.map((jobTitle) => ({
                  value: jobTitle.id.toString(),
                  label: jobTitle.title,
                }))}
                selectedValue={filters.jobId}
                onSelect={(value) => setFilters({ jobId: value })}
              />

              <FilterDropdown
                label="Industry"
                options={industries.map((industry) => ({
                  value: industry.id.toString(),
                  label: industry.name,
                }))}
                selectedValue={filters.industryId}
                onSelect={(value) => setFilters({ industryId: value })}
              />
            </div>

            <div className="max-h-[565px] overflow-y-auto space-y-6 p-2">
              <JobList
                useFetchJobs={useFetchJobs}
                useHasMore={useJobsHasMore}
                useIsLoading={useJobsIsLoading}
                useJobs={useJobs}
                useSelectedJobId={useSelectedJobId}
                useSetSelectedJobId={useSetSelectedJobId}
              />
            </div>
          </div>

          <div>
            <ReviewsSection />
          </div>
        </div>
      </div>

      <JobDetailsDialog
        useIsOpen={useIsJobDetailsDialogOpen}
        useSetIsOpen={setJobDetailsDialogOpen}
      />
    </div>
  );
}
