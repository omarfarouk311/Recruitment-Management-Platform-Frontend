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

const countryOptions = Country.getAllCountries()
      .filter((country) => {
          const cities = City.getCitiesOfCountry(country.isoCode) ?? [];
          return cities.length > 0;
      })
      .map((country) => ({
          value: country.name,
          label: country.name,
      }));

const LocationSearch = ({
  selectedCountry,
  onCountryChange,
  selectedCity,
  onCityChange,
  disabled,
}: LocationSearchProps) => {
  
  const cityOptions = [
    ...(selectedCountry
      ? City.getCitiesOfCountry(
          Country.getAllCountries().find(
            (country) => country.name === selectedCountry
          )?.isoCode!
        )?.map((city) => ({
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
