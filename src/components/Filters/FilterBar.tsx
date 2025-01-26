import { Loader } from "lucide-react";
import filterLogo from "../../assets/filter-logo.png";
import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  onApply?: () => void;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
}

const FilterBar = ({
  children,
  onApply,
  isLoading = false,
  hasActiveFilters = false,
}: FilterBarProps) => {
  return (
    <div className="flex items-center space-x-6">
      <button
        onClick={onApply}
        disabled={isLoading || !hasActiveFilters}
        className={`p-1 border-2 rounded-full transition-all ${
          hasActiveFilters ? "border-blue-500" : "border-transparent"
        } ${!hasActiveFilters ? "opacity-50" : "hover:border-blue-600"}`}
      >
        <div className="w-7 h-7 flex items-center justify-center">
          {isLoading ? (
            <Loader className="animate-spin w-5 h-5" />
          ) : (
            <img
              src={filterLogo}
              alt="Apply filters"
              className={`transition-all ${
                !hasActiveFilters ? "grayscale" : ""
              }`}
            />
          )}
        </div>
      </button>

      {children}
    </div>
  );
};

export default FilterBar;
