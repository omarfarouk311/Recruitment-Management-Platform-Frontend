import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../common/Button";

interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: "primary" | "outline" | "currentTab";
  className?: string;
  disabled?: boolean;
}

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  variant = "outline",
  className = "",
  disabled = false,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant={selectedValue !== "" ? "currentTab" : variant}
        className={"h-7 w-auto text-sm " + className}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        type="button"
        disabled={disabled}
      >
        <div className="flex items-center pe-4">
          {label}
          {selectedValue !== "" && selectedLabel && ` (${selectedLabel})`}
          <ChevronDown className="w-4 h-4 absolute right-3" />
        </div>
      </Button>

      {isOpen && !disabled && (
        <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg z-10 w-48 max-h-72 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                option.value === selectedValue ? "bg-gray-200 font-medium" : ""
              }`}
              role="option"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
