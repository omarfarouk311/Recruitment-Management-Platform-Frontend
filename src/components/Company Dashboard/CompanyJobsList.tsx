
import { useEffect, useState } from "react";
import useStore from "../../stores/globalStore";
import JobList from '../CompanyJobs/ComponyJobList'


const CompanyJobsList = () => {

    const useFetchJobs = useStore.useCompanyFetchJobs;
    const fetchJobs = useFetchJobs();
    const useHasMore = useStore.useCompanyJobsHasMore;
    const useIsLoading = useStore.useCompanyJobsIsJobsLoading;
    const useJobs = useStore.useCompanyJobs;
    const useSelectedJobId = useStore.useCompanyTabSelectJobId;
    const useSetSelectedJobId = useStore.useCompanyTabSetSelectedJobId;
    const resetCompanyJobs = useStore.useJobListClear();
  
    useEffect(() => {
        console.log("in company jobs list");
        resetCompanyJobs();
        fetchJobs();
    }, []);  

    return (
        <JobList
            useFetchJobs={useFetchJobs}
            useHasMore={useHasMore}
            useIsLoading={useIsLoading}
            useJobs={useJobs}
            useSelectedJobId={useSelectedJobId}
            useSetSelectedJobId={useSetSelectedJobId}
        />
    );

}

export default CompanyJobsList;
