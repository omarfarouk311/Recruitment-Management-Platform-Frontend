import { User, Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "../common/SearchBar";
import { LocationSearch } from "../common/LocationSearch";
import { TextInput } from "../common/TextInput";
import useJobStore from "../../stores/useJobStore";

const UserNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { searchCriteria, setSearchCriteria, isLoading, applySearch } =
    useJobStore();

  const isSearchDisabled =
    !searchCriteria.jobQuery &&
    !searchCriteria.country &&
    !searchCriteria.city &&
    !searchCriteria.companyQuery;

  const handleSearch = async () => {
    if (!isSearchDisabled) {
      await applySearch();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b-2 border-gray-300">
      <div className="flex items-center space-x-4">
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

      {/* Search Bar */}
      <div className="flex">
        <SearchBar
          onSearch={handleSearch}
          isSearching={isLoading}
          disabled={isSearchDisabled}
        >
          <TextInput
            value={searchCriteria.jobQuery}
            onChange={(value) => setSearchCriteria({ jobQuery: value })}
            placeholder="Job title"
            disabled={isLoading}
          />
          <LocationSearch
            selectedCountry={searchCriteria.country}
            onCountryChange={(value) => setSearchCriteria({ country: value })}
            selectedCity={searchCriteria.city}
            onCityChange={(value) => setSearchCriteria({ city: value })}
            disabled={isLoading}
          />
          <TextInput
            value={searchCriteria.companyQuery}
            onChange={(value) => setSearchCriteria({ companyQuery: value })}
            placeholder="Company"
            disabled={isLoading}
          />
        </SearchBar>
      </div>

      {/* Home Button */}
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
  );
};

export default UserNav;
