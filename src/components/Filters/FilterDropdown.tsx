import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../common/Button";

interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: "primary" | "outline" | "currentTab";
}

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  variant = "outline",
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  return (
    <div className="relative">
      <Button
        variant={selectedValue !== "any" ? "currentTab" : variant}
        className="py-[4px] text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {label}
          {selectedValue !== "any" && selectedLabel && ` (${selectedLabel})`}
        </span>
        <ChevronDown className="w-4 h-4 ml-2 mt-1" />
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
