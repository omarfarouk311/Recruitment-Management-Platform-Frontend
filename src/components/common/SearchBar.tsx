import { Search } from "lucide-react";
import { ReactNode, FormEvent } from "react";

interface SearchBarProps {
  onSearch: () => void;
  isSearching: boolean;
  children: ReactNode;
  disabled?: boolean;
}

export const SearchBar = ({
  onSearch,
  isSearching,
  children,
  disabled,
}: SearchBarProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <button
        type="submit"
        disabled={isSearching || disabled}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <Search className="w-7 h-7" />
      </button>
      {children}
    </form>
  );
};
