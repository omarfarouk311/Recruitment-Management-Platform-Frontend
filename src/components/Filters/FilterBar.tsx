import { ChevronDown, Loader } from "lucide-react";
import filterLogo from "../../assets/filter-logo.png";
import { useState } from "react";
import Button from "../common/Button";

interface Option {
  value: string;
  label: string;
}

// Filter options
const dateOptions: Option[] = [
  { value: "any", label: "Any" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const ratingOptions: Option[] = [
  { value: "any", label: "Any" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
  { value: "2", label: "2 stars & up" },
];

const industryOptions: Option[] = [
  { value: "any", label: "Any Industry" },
  { value: "tech", label: "Technology" },
  { value: "health", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
];

const FilterBar = () => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("any");
  const [selectedRating, setSelectedRating] = useState<string>("any");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("any");
  const [isLoading, setIsLoading] = useState(false);

  const hasActiveFilters = [
    selectedDate,
    selectedRating,
    selectedIndustry,
  ].some((value) => value !== "any");

  const handleApplyFilters = async () => {
    if (!hasActiveFilters) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Applying filters:", {
      date: selectedDate,
      rating: selectedRating,
      industry: selectedIndustry,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex items-center space-x-6">
      <button
        onClick={handleApplyFilters}
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

      {/* Date Posted Dropdown */}
      <div className="relative">
        <Button
          variant={selectedDate !== "any" ? "currentTab" : "outline"}
          className="py-0.5 text-sm"
          onClick={() => setIsDateOpen(!isDateOpen)}
        >
          <span>
            Date Posted
            {selectedDate !== "any" &&
              ` (${dateOptions.find((o) => o.value === selectedDate)?.label})`}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 mt-1" />
        </Button>

        {isDateOpen && (
          <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg z-10 w-48">
            {dateOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedDate(option.value);
                  setIsDateOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Industry Dropdown */}
      <div className="relative">
        <Button
          variant={selectedIndustry !== "any" ? "currentTab" : "outline"}
          className={`py-0.5 text-sm`}
          onClick={() => setIsIndustryOpen(!isIndustryOpen)}
        >
          <span>
            Industry
            {selectedIndustry !== "any" &&
              ` (${
                industryOptions.find((o) => o.value === selectedIndustry)?.label
              })`}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 mt-1" />
        </Button>

        {isIndustryOpen && (
          <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg z-10 w-48">
            {industryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedIndustry(option.value);
                  setIsIndustryOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Rating Dropdown */}
      <div className="relative">
        <Button
          variant={selectedRating !== "any" ? "currentTab" : "outline"}
          className="py-0.5 text-sm"
          onClick={() => setIsRatingOpen(!isRatingOpen)}
        >
          <span>
            Company Rating
            {selectedRating !== "any" &&
              ` (${
                ratingOptions.find((o) => o.value === selectedRating)?.label
              })`}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 mt-1" />
        </Button>

        {isRatingOpen && (
          <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg z-10 w-48">
            {ratingOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedRating(option.value);
                  setIsRatingOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
