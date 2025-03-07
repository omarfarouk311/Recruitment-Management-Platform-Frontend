import { User, Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import TextInput from "../common/TextInput";
import useJobStore from "../../stores/GlobalStore";

const UserNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeTab = useJobStore.useHomeActiveTab();
  const isLoading = useJobStore.useIsLoading();
  let searchCriteria: string;
  let setSearchCriteria: (query: string) => void;
  let applySearch: () => Promise<void>;

  if (activeTab === "For You") {
    searchCriteria = useJobStore.useJobSearchQuery();
    setSearchCriteria = useJobStore.useSetJobSearchQuery();
    applySearch = useJobStore.useApplyJobSearch();
  } else {
    searchCriteria = useJobStore.useCompanySearchQuery();
    setSearchCriteria = useJobStore.useSetCompanySearchQuery();
    applySearch = useJobStore.useApplyJobSearch();
  }

  const isSearchDisabled = !searchCriteria;

  const handleSearch = async () => {
    if (!isSearchDisabled) {
      await applySearch();
    }
  };

  return (
    <div className="flex items-center px-6 py-4 h-20 bg-white shadow-sm border-b-2 border-gray-300 relative">
      {/* Left Section (Profile and Dashboard Buttons) */}
      <div className="flex items-center space-x-4 absolute left-6">
        {/* Profile Button */}
        {currentPath === "/profile" ? (
          <span
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <User className="w-6 h-6" />
            <span className="font-medium">User 1</span>
          </span>
        ) : (
          <Link
            to="/profile"
            className="flex items-center space-x-2 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="font-medium">User 1</span>
          </Link>
        )}

        {/* Dashboard Button */}
        {currentPath === "/dashboard" ? (
          <span
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium">Dashboard</span>
          </span>
        ) : (
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium">Dashboard</span>
          </Link>
        )}
      </div>

      {/* Centered Search Bar */}
      <div className="flex justify-center flex-grow">
        <SearchBar
          onSearch={handleSearch}
          isSearching={isLoading}
          disabled={isSearchDisabled}
        >
          <TextInput
            value={searchCriteria}
            onChange={(value) => setSearchCriteria(value)}
            placeholder={
              activeTab === "For You"
                ? "Find your next job"
                : "Search for a company"
            }
            disabled={isLoading}
          />
        </SearchBar>
      </div>

      {/* Right Section (Home Button) */}
      <div className="absolute right-6">
        {currentPath === "/home" ? (
          <span
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <Home className="w-6 h-6" />
          </span>
        ) : (
          <Link
            to="/home"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Home className="w-6 h-6" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserNav;
