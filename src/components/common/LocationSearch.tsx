import { Country, City } from "country-state-city";

interface LocationSearchProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  disabled?: boolean;
}

export const LocationSearch = ({
  selectedCountry,
  onCountryChange,
  selectedCity,
  onCityChange,
  disabled,
}: LocationSearchProps) => {
  const countries = Country.getAllCountries();
  const cities = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry)
    : [];

  return (
    <>
      {/* Country Select */}
      <div className="w-48 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer border-2 border-gray-200">
        <select
          value={selectedCountry}
          onChange={(e) => {
            onCountryChange(e.target.value);
            onCityChange(""); // Reset city on country change
          }}
          className="bg-transparent outline-none w-full cursor-pointer"
          disabled={disabled}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Select */}
      <div
        className={`w-48 bg-gray-100 rounded-full px-4 py-2 transition-colors border-2 border-gray-200 ${
          !selectedCountry || disabled
            ? "opacity-50"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
      >
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="bg-transparent outline-none w-full cursor-pointer"
          disabled={!selectedCountry || disabled}
        >
          <option value="">Select city</option>
          {cities?.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
