import { Search } from "lucide-react";
import { FormEvent } from "react";
import TextInput from "./TextInput";
import { ForYouTabSlice } from "../../stores/Seeker Home Slices/forYouTabSlice";
import { CompaniesTabSlice } from "../../stores/Seeker Home Slices/companiesTabSlice";

interface SearchBarProps {
  useIsLoading: () =>
    | ForYouTabSlice["forYouTabIsJobsLoading"]
    | CompaniesTabSlice["companiesTabIsCompaniesLoading"];
  useSearchQuery: () =>
    | ForYouTabSlice["forYouTabSearchQuery"]
    | CompaniesTabSlice["companiesTabSearchQuery"];
  useSetSearchQuery: () =>
    | ForYouTabSlice["forYouTabSetSearchQuery"]
    | CompaniesTabSlice["companiesTabSetSearchQuery"];
  useApplySearch: () =>
    | ForYouTabSlice["forYouTabApplySearch"]
    | CompaniesTabSlice["companiesTabApplySearch"];
  placeHolder: string;
  loadingTab?: number | null;
}

const SearchBar = ({
  useIsLoading,
  useSearchQuery,
  useApplySearch,
  useSetSearchQuery,
  placeHolder,
  loadingTab,
}: SearchBarProps) => {
  const isLoading = useIsLoading();
  const searchQuery = useSearchQuery();
  const applySearch = useApplySearch();
  const setSearchQuery = useSetSearchQuery();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applySearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 w-full max-w-sm"
    >
      <button
        type="submit"
        disabled={isLoading || !searchQuery || loadingTab !== null}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <Search className="w-7 h-7" />
      </button>
      <TextInput
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
        placeholder={placeHolder}
        disabled={isLoading}
      />
    </form>
  );
};

export default SearchBar;
