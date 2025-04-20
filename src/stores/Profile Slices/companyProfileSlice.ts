import { CombinedState } from '../storeTypes.ts';
import { StateCreator } from 'zustand';
import { CompanyProfileInfo, UserCredentials } from '../../types/profile.ts';
import { CompanyProfileReviewsFilters, Review } from '../../types/review.ts';
import config from "../../../config/config.ts";
import { formatDistanceToNow, formatDate } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserRole } from '../User Slices/userSlice.ts';
import { Job } from '../../types/job.ts';
import { CompanyProfileJobsFilters } from '../../types/job.ts';
const { paginationLimit } = config;

export interface CompanyProfileSlice {
    companyProfileInfo: CompanyProfileInfo;
    companyProfileSelectedId: number | null;
    companyProfileUpdateInfo: (profile: CompanyProfileInfo) => Promise<void>;
    companyProfileFetchInfo: () => Promise<void>;
    companyProfileSetSelectedId: (id: number) => Promise<void>;
    /* industries will be used in the company industries dialog, and to populate industries filter
    in the jobs section*/
    companyProfileFetchIndustries: () => Promise<void>;
    companyProfileFetchLocations: () => Promise<void>;

    companyCredentials: UserCredentials;
    companyProfileFetchEmail: () => Promise<void>;
    companyProfileUpdateCredentials: (credentials: UserCredentials) => Promise<void>;

    companyProfileReviews: Review[];
    companyProfileReviewsHasMore: boolean;
    companyProfileReviewsPage: number;
    companyProfileReviewsIsLoading: boolean;
    companyProfileReviewsFilters: CompanyProfileReviewsFilters;
    companyProfileFetchReviews: () => Promise<void>;
    companyProfileSetReviewsFilters: (filters: Partial<CompanyProfileSlice['companyProfileReviewsFilters']>) => Promise<void>;

    companyProfileJobs: Job[];
    companyProfileJobsPage: number;
    companyProfileJobsHasMore: boolean;
    companyProfileIsJobsLoading: boolean;
    companyProfileJobsFilters: CompanyProfileJobsFilters;
    companyProfileIsJobDetailsDialogOpen: boolean;
    companyProfileJobTitlesFilter: { id: number; title: string }[];
    companyProfileFetchJobs: () => Promise<void>;
    companyProfileSetSelectedJobId: (id: number) => Promise<void>;
    companyProfileSetJobsFilters: (filters: Partial<CompanyProfileSlice['companyProfileJobsFilters']>) => Promise<void>;
    companyProfileFetchJobTitlesFilter: () => Promise<void>;
    companyProfileSetJobDetailsDialogOpen: (isOpen: boolean) => void;

    companyProfileClear: () => void;
}

export const createCompanyProfileSlice: StateCreator<CombinedState, [], [], CompanyProfileSlice> = (set, get) => ({
    companyProfileInfo: {
        id: 0,
        name: '',
        image: '',
        overview: '',
        type: '',
        foundedIn: 0,
        size: 0,
        rating: 0,
        reviewsCount: 0,
        locationsCount: 0,
        industriesCount: 0,
        jobsCount: 0,
        locations: [],
        industries: [],
    },
    companyCredentials: {
        email: '',
        password: ''
    },
    companyProfileReviews: [],
    companyProfileReviewsHasMore: true,
    companyProfileReviewsPage: 1,
    companyProfileReviewsIsLoading: false,
    companyProfileSelectedId: null,
    companyProfileJobs: [],
    companyProfileJobsPage: 1,
    companyProfileJobsHasMore: true,
    companyProfileIsJobsLoading: false,
    companyProfileJobsFilters: {
        sortByDate: '',
        industryId: '',
        jobId: '',
        remote: false,
    },
    companyProfileIsJobDetailsDialogOpen: false,
    companyProfileJobTitlesFilter: [],
    companyProfileReviewsFilters: {
        sortByDate: '',
        rating: '',
    },

    companyProfileUpdateInfo: async (profile) => {
        set({ companyProfileInfo: profile });
    },

    companyProfileFetchInfo: async () => {
        // Add logic to fetch company profile info
        
        const { companyProfileJobsHasMore, userId ,companyProfileSelectedId} = get();
        if (!companyProfileJobsHasMore || !userId) return;
        

        try {
            const response = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}`);
            const companyData = response.data;

            set({
                companyProfileInfo: {
                    id: companyData.id,
                    name: companyData.name,
                    image: `${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/image`,
                    overview: companyData.overview,
                    type: companyData.type,
                    foundedIn: companyData.foundedIn,
                    size: companyData.size,
                    rating: companyData.rating,
                    reviewsCount: companyData.reviewsCount,
                    locationsCount: companyData.locationsCount,
                    industriesCount: companyData.industriesCount,
                    jobsCount: companyData.jobsCount,
                    locations: [], // not present in backend
                    industries: [], // not present in backend
                },
                
            });
        } catch (error) {
            console.error('Error fetching company profile:', error);
            toast.error('Failed to fetch company profile');
        }

    },

    companyProfileSetSelectedId: async (id) => {
        set({ companyProfileSelectedId: id, companyProfileIsJobDetailsDialogOpen: true });
    },

    companyProfileFetchIndustries: async () => {
        
        const {  companyProfileJobsHasMore, userId,companyProfileSelectedId } = get();
        if (!companyProfileJobsHasMore || !userId) return;

        try{

            const rest = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/industries`);
            const industriesData = rest.data;
            
            const industries = industriesData.map((industry: { id: number, name: string }) => ({
                id: industry.id,
                name: industry.name
            }));
            
            set(state => ({
                companyProfileInfo: {
                    ...state.companyProfileInfo,
                    industries: industries
                },
                
            }));
        }
        catch(err){
            console.error('Error fetching company industries:', err);
            toast.error('Failed to fetch company industries');
            
        }
    },

    companyProfileFetchLocations: async () => {
       const {  companyProfileJobsHasMore, userId,companyProfileSelectedId } = get();
       if (!companyProfileJobsHasMore ||  !userId) return;
         

        try{
            const rest = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/locations`);
            const locationsData = rest.data;
            
            const locations = locationsData.map((location: { country: string, city: string }) => ({
                country: location.country,
                city: location.city
            }));
            
            set(state => ({
                companyProfileInfo: {
                    ...state.companyProfileInfo,
                    locations: locations
                },
                
            }));
        }
        catch(err){
            console.error('Error fetching company locations:', err);
            toast.error('Failed to fetch company locations');
            
        }

    },

    //TODO: Need endpoint for fetching email
    companyProfileFetchEmail: async () => {
        // Add logic to fetch email
    },

    //TODO: Need endpoint for updating credentials
    companyProfileUpdateCredentials: async (credentials) => {
        set({ companyCredentials: credentials });
    },

    companyProfileFetchReviews: async () => {
        const { companyProfileReviewsIsLoading, companyProfileReviewsHasMore, companyProfileReviewsPage,companyProfileReviewsFilters ,userId,companyProfileSelectedId } = get();
        if (!companyProfileReviewsHasMore || companyProfileReviewsIsLoading || !userId) return;
        set({ companyProfileReviewsIsLoading: true });

        const params={
            page: companyProfileReviewsPage || undefined,
            limit: paginationLimit || undefined, 
            sortByDate: companyProfileReviewsFilters.sortByDate || undefined,
            rating: companyProfileReviewsFilters.rating || undefined,
        }

        for (const key in params) {
            if (params[key as keyof typeof params] === undefined) {
                delete params[key as keyof typeof params];
            }
        }

        try{
            const response = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/reviews`, {params});


            const reviewsData = response.data;
            const reviews = reviewsData.map((review: Review) => ({
                id: review.id ?? 0,
                title: review.title ?? '',
                role: review.role ?? '',
                createdAt: review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : '',
                rating: review.rating ?? 0,
                description: review.description ?? '',
                date: review.createdAt ? formatDate(new Date(review.createdAt), 'dd/MM/yyyy') : ''
            }));

            set((state) => ({
                companyProfileReviews: [...state.companyProfileReviews, ...reviews],
                companyProfileReviewsHasMore: reviews.length === paginationLimit,
                companyProfileReviewsPage: state.companyProfileReviewsPage + 1,
                companyProfileReviewsIsLoading: false
            }));
        }
        catch(err){
            console.error('Error fetching company reviews:', err);
            toast.error('Failed to fetch company reviews');
            set({ companyProfileReviewsIsLoading: false });
        }
    },

    companyProfileSetReviewsFilters: async (filters) => {
        set((state) => ({
            companyProfileReviewsFilters: { ...state.companyProfileReviewsFilters, ...filters },
        }));        
    },

    companyProfileFetchJobs: async () => {
        const { companyProfileIsJobsLoading, companyProfileJobsHasMore, companyProfileJobsPage, companyProfileJobsFilters, userId,companyProfileSelectedId } = get();
        if (!companyProfileJobsHasMore || companyProfileIsJobsLoading || !userId) return;
    
        set({ companyProfileIsJobsLoading: true });
      
        const params = {
          page: companyProfileJobsPage,
          sortByDate: companyProfileJobsFilters.sortByDate || undefined,
          industry: companyProfileJobsFilters.industryId || undefined,
          jobId: companyProfileJobsFilters.jobId || undefined,
          remote: companyProfileJobsFilters.remote || undefined, // Send true/false directly
        };
      
        // Delete undefined keys
        for (const key in params) {
          if (params[key as keyof typeof params] === undefined) {
            delete params[key as keyof typeof params];
          }
        }
      
        try {
          const response = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/jobs`, { params });
          const jobsData = response.data; 
          const jobs = jobsData.map((job: Job) => ({
            id: job.id ?? 0,
            title: job.title ?? '',
            // Map to correct fields from Job interface
            country: job.country ?? '',       
            city: job.city ?? '',             
            datePosted: job.datePosted ? formatDistanceToNow(new Date(job.datePosted), { addSuffix: true }) : '',
            companyData: {
                id: job.companyData?.id ?? 0,          
                name: job.companyData?.name ?? '',
                rating: job.companyData?.rating ?? 0,
                image: job.companyData?.image ?? ''
              }
          }));
      
          set((state) => ({
            companyProfileJobs: [...state.companyProfileJobs, ...jobs],
            companyProfileJobsHasMore: jobs.length === paginationLimit,
            companyProfileJobsPage: state.companyProfileJobsPage + 1,
            companyProfileIsJobsLoading: false,
          }));
        } catch (err) {
          console.error('Error fetching company jobs:', err);
          toast.error('Failed to fetch jobs');
          set({ companyProfileIsJobsLoading: false });
        }
      },

    companyProfileSetSelectedJobId: async (id) => {
        set({ companyProfileIsJobDetailsDialogOpen: true });
        get().forYouTabSetSelectedJobId(id);
    },

    //needs to be revised
    companyProfileSetJobsFilters: async (filters) => {
        set((state) => ({
            companyProfileJobsFilters: { ...state.companyProfileJobsFilters, ...filters },
            companyProfileJobsPage: 1,
            companyProfileJobs: [],
            companyProfileJobsHasMore: true,
        }));
        await get().companyProfileFetchJobs();
      },

    //needs to be revised
    companyProfileFetchJobTitlesFilter: async () => {
      const { companyProfileJobsHasMore, userId, companyProfileSelectedId,companyProfileJobsPage } = get();
      if (!companyProfileJobsHasMore || !userId) return;

      try {
        const rest = await axios.get(`${config.API_BASE_URL}/companies/${companyProfileSelectedId||userId}/jobs`, {
            params: { 
                page: companyProfileJobsPage,
                filterBar: true }
        });
        const jobTitlesData = rest.data;
        
        const jobTitles = jobTitlesData.map((jobTitle: { id: number, title: string }) => ({
            id: jobTitle.id,
            title: jobTitle.title
        }));
        
        set(state => ({
            companyProfileJobTitlesFilter: jobTitles
        }));
      }
      catch(err) {
        console.error('Error fetching company job titles:', err);
        toast.error('Failed to fetch company job titles');
      }
    },

    companyProfileSetJobDetailsDialogOpen: (isOpen) => {
        set({ companyProfileIsJobDetailsDialogOpen: isOpen });
    },

    companyProfileClear: () => {
        set({
            companyProfileInfo: {
                id: 0,
                name: '',
                image: '',
                overview: '',
                type: '',
                foundedIn: 0,
                size: 0,
                rating: 0,
                reviewsCount: 0,
                locationsCount: 0,
                industriesCount: 0,
                jobsCount: 0,
                locations: [],
                industries: [],
            },
            companyCredentials: {
                email: '',
                password: ''
            },
            companyProfileReviews: [],
            companyProfileReviewsHasMore: true,
            companyProfileReviewsPage: 1,
            companyProfileReviewsIsLoading: false,
            companyProfileSelectedId: null,
            companyProfileJobs: [],
            companyProfileJobsPage: 1,
            companyProfileJobsHasMore: true,
            companyProfileIsJobsLoading: false,
            companyProfileJobsFilters: {
                sortByDate: '',
                industryId: '',
                jobId: '',
                remote: false,
            },
            companyProfileJobTitlesFilter: []
        });
    },
});