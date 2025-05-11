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
  addAnyOption?: boolean;
}

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  variant = "outline",
  className = "",
  disabled = false,
  addAnyOption = true,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  options = addAnyOption? [
    { value: "", label: "Any" },
    ...options.sort((a, b) => a.label.localeCompare(b.label)),
  ]: [...options.sort((a, b) => a.label.localeCompare(b.label))];
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

  useEffect(() => {
    if (isOpen && !disabled) {
      dropdownMenuRef.current?.focus();
    }
  }, [isOpen, disabled]);

  useEffect(() => {
    if (highlightedValue !== null) {
      const element = dropdownMenuRef.current?.querySelector(
        `[data-value="${highlightedValue}"]`
      );
      if (element) {
        element.scrollIntoView({ block: "nearest" });
        const timeout = setTimeout(() => {
          setHighlightedValue(null);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [highlightedValue]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key.length === 1 && key >= "a" && key <= "z") {
      const foundOption = options.find((option) =>
        option.label.toLowerCase().startsWith(key)
      );
      if (foundOption) {
        setHighlightedValue(foundOption.value);
        event.preventDefault();
      }
    }
  };

  return (
    <div className={"relative " + className} ref={dropdownRef}>
      <Button
        variant={selectedValue !== "" ? "currentTab" : variant}
        className="h-7 w-auto text-sm "
        onClick={() => !disabled && setIsOpen(!isOpen)}
        type="button"
        disabled={disabled}
      >
        <div className="flex items-center pe-4 -ml-2">
          {label}
          {selectedValue !== "" && selectedLabel && ` (${selectedLabel})`}
          <ChevronDown className="w-4 h-4 absolute right-3" />
        </div>
      </Button>

      {isOpen && !disabled && (
        <div
          ref={dropdownMenuRef}
          tabIndex={-1}
          className="absolute top-8 bg-white border rounded-lg shadow-lg z-10 min-w-48 max-w-76 max-h-72 overflow-y-auto outline-none"
          onKeyDown={handleKeyDown}
        >
          {options.map((option) => (
            <button
              key={option.value}
              data-value={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                option.value === selectedValue ? "bg-gray-200 font-medium" : ""
              } ${option.value === highlightedValue ? "bg-gray-200" : ""}`}
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
