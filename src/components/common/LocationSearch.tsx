// LocationSearch.tsx
import { Country, City } from "country-state-city";
import FilterDropdown from "../Filters/FilterDropdown";

interface LocationSearchProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  disabled?: boolean;
}

const LocationSearch = ({
  selectedCountry,
  onCountryChange,
  selectedCity,
  onCityChange,
  disabled,
}: LocationSearchProps) => {
  const countryOptions = [
    { value: "", label: "Any" },
    ...Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    })),
  ];

  const cityOptions = [
    { value: "", label: "Any" },
    ...(selectedCountry
      ? City.getCitiesOfCountry(selectedCountry)?.map((city) => ({
          value: city.name,
          label: city.name,
        })) || []
      : []),
  ];

  return (
    <>
      <FilterDropdown
        label="Country"
        options={countryOptions}
        selectedValue={selectedCountry}
        onSelect={onCountryChange}
        disabled={disabled}
      />
      <FilterDropdown
        label="City"
        options={cityOptions}
        selectedValue={selectedCity}
        onSelect={onCityChange}
        disabled={!selectedCountry || disabled}
      />
    </>
  );
};

export default LocationSearch;
