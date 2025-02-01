import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../common/Button";

interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: "primary" | "outline" | "currentTab";
  className?: string;
}

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  variant = "outline",
  className = "",
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  return (
    <div className="relative">
      <Button
        variant={selectedValue !== "any" ? "currentTab" : variant}
        className={"h-7 text-sm " + className}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {label}
          {selectedValue !== "any" && selectedLabel && ` (${selectedLabel})`}
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg z-10 w-40">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
