import { SlidersHorizontal } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import LocationSearch from "../common/LocationSearch";
import { ratingOptions, typeOptions, sizeOptions } from "../../data/filterOptions";
import { CompaniesTabFilters } from "../../types/company";
import { useCallback } from "react";

interface FilterSectionProps {
  useFilters: () => CompaniesTabFilters;
  useIndustryOptions: () => { value: string; label: string }[];
  useSetFilters: () => (filters: Partial<CompaniesTabFilters>) => Promise<void>;
}

const FilterSection = ({ useFilters, useIndustryOptions, useSetFilters }: FilterSectionProps) => {
  const filters = useFilters();
  const industryOptions = useIndustryOptions();
  const setFilters = useSetFilters();

  return (
    <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 shadow">
      <div className="flex items-center gap-14 mb-6">
        <SlidersHorizontal className="h-7 w-7" />
        <h2 className="text-2xl font-semibold">Filter Companies</h2>
      </div>

      <div className="space-y-6 h-[650px] overflow-y-auto hide-scrollbar px-2">
        {/* Location Search */}
        <div className="bg-gray-100 px-4 py-3 rounded-3xl mb-4 w-full">
          <div className="flex space-x-4">
            <p className="mb-4 text-2xl font-semibold">Location</p>
          </div>
          <div className="flex-col space-y-4">
            <LocationSearch
              selectedCountry={filters.country}
              onCountryChange={useCallback((value) => setFilters({ country: value, city: "" }), [])}
              selectedCity={filters.city}
              onCityChange={useCallback((value) => setFilters({ city: value }), [])}
            />
          </div>
        </div>

        {/* Industry Dropdown */}
        {
          <div className="bg-gray-100 px-4 py-3 rounded-3xl mb-4 w-full">
            <p className="mb-4 text-2xl font-semibold">Industry</p>
            <FilterDropdown
              label="Industry"
              options={industryOptions}
              selectedValue={filters.industry}
              onSelect={(value) => setFilters({ industry: value })}
            />
          </div>
        }

        {/* Company Size Dropdown */}
        <div className="bg-gray-100 px-4 py-3 rounded-3xl mb-4 w-full">
          <p className="mb-4 text-2xl font-semibold">Company Size</p>
          <FilterDropdown
            label="Company Size"
            options={sizeOptions}
            selectedValue={filters.size}
            onSelect={(value) => setFilters({ size: value })}
          />
        </div>

        {/* Rating Dropdown */}
        <div className="bg-gray-100 px-4 py-3 rounded-3xl mb-4 w-full">
          <p className="mb-4 text-2xl font-semibold">Company Rating</p>
          <FilterDropdown
            label="Company Rating"
            options={ratingOptions}
            selectedValue={filters.rating}
            onSelect={(value) => setFilters({ rating: value })}
          />
        </div>

        {/* Company Type Dropdown */}
        <div className="bg-gray-100 px-4 py-3 rounded-3xl mb-4 w-full">
          <p className="mb-4 text-2xl font-semibold">Company Type</p>
          <FilterDropdown
            label="Company Type"
            options={typeOptions}
            selectedValue={filters.type}
            onSelect={(value) => setFilters({ type: value })}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
