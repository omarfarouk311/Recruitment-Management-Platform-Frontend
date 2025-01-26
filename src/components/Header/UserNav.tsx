import { User, Home, LayoutDashboard, Search, Loader } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Country, City } from "country-state-city";
import { useState } from "react";

const UserNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [jobQuery, setJobQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get all countries
  const countries = Country.getAllCountries();

  // Get cities based on selected country
  const cities = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry)
    : [];

  const handleSearch = async () => {
    if (jobQuery || selectedCountry || selectedCity || companyQuery) {
      setIsSearching(true);

      // Mock search with 1.5 second delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSearching(false);
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

      <div className="flex items-center space-x-4">
        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={
            isSearching ||
            !(jobQuery || selectedCountry || selectedCity || companyQuery)
          }
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        >
          {isSearching ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Search className="w-6 h-6" />
          )}
        </button>

        {/* Job Search */}
        <div className="flex items-center w-48 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Job title"
            className="bg-transparent outline-none w-full"
            value={jobQuery}
            onChange={(e) => setJobQuery(e.target.value)}
          />
        </div>

        {/* Country Select */}
        <div className="w-48 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedCity("");
            }}
            className="bg-transparent outline-none w-full cursor-pointer"
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Select */}
        <div
          className={`w-48 bg-gray-100 rounded-full px-4 py-2 transition-colors ${
            !selectedCountry || isSearching
              ? "opacity-50"
              : "hover:bg-gray-200 cursor-pointer"
          }`}
        >
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent outline-none w-full cursor-pointer"
            disabled={!selectedCountry || isSearching}
          >
            <option value="">Select city</option>
            {cities?.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Company Search */}
        <div className="flex items-center w-48 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Company"
            className="bg-transparent outline-none w-full"
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
            disabled={isSearching}
          />
        </div>
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
