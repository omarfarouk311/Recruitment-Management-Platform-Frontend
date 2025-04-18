import { Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyCard } from "../../types/company";
import InfoDialog from "../common/InfoDialog";
import { useState } from "react";

interface CompanyCardProps {
  company: CompanyCard;
  useFetchCompanyIndustries: () => (id: number) => Promise<void>;
  useFetchCompanyLocations: () => (id: number) => Promise<void>;
}

const CompanyCard = ({
  company: {
    id,
    name,
    industriesCount,
    jobsCount,
    locationsCount,
    overview,
    rating,
    reviewsCount,
    size,
    image,
    industries,
    locations,
  },
  useFetchCompanyIndustries,
  useFetchCompanyLocations,
}: CompanyCardProps) => {
  const [isIndustriesDialogOpen, setIndustriesDialogOpen] = useState(false);
  const [isLocationsDialogOpen, setLocationsDialogOpen] = useState(false);
  const fetchCompanyIndustries = useFetchCompanyIndustries();
  const fetchCompanyLocations = useFetchCompanyLocations();

  return (
    <>
      <div className="bg-gray-100 rounded-3xl p-6 space-y-6 border-2 border-gray">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center">
              {image ? (
                <img src={image} />
              ) : (
                <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold">{name}</h3>
                <Link to="/seeker/company-profile" className="px-2">
                  <ExternalLink className="w-5 h-6  cursor-pointer text-blue-600" />
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{rating}</span>
                <Star className="h-4 w-4 fill-current text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="flex mx-5 mb-2 space-x-24">
            <div className="text-center">
              <Link to="/seeker/company-profile#reviews">
                <div className="text-xl font-semibold text-blue-500">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 1,
                    maximumSignificantDigits: 3,
                    signDisplay: "never",
                  }).format(reviewsCount)}
                </div>
              </Link>
              <div className="text-sm text-black text-center font-semibold">
                Reviews
              </div>
            </div>

            <div className="text-center">
              <Link to="/seeker/company-profile#jobs">
                <div className="text-xl font-semibold text-blue-500">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 1,
                    maximumSignificantDigits: 3,
                    signDisplay: "never",
                  }).format(jobsCount)}
                </div>
              </Link>
              <div className="text-sm text-black text-center font-semibold">
                Jobs
              </div>
            </div>
          </div>
        </div>

        <div className="flex mx-8 space-x-44">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-1">Locations</h4>
            <button
              className="text-blue-600 hover:underline cursor-pointer underline-offset-2"
              title="View Locations"
              onClick={() => {
                setLocationsDialogOpen(true);
                fetchCompanyLocations(id);
              }}
            >
              {locationsCount} {locationsCount > 1 ? "Locations" : "Location"}
            </button>
          </div>

          <div className="text-center">
            <h4 className="text-lg font-semibold mb-1">Company Size</h4>
            <p className="text-center text-black">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
                maximumSignificantDigits: 3,
                signDisplay: "never",
              }).format(size)}{" "}
              Employees
            </p>
          </div>

          <div className="text-center">
            <h4 className="text-lg font-semibold mb-1">Industries</h4>
            <button
              className="text-blue-600 hover:underline cursor-pointer underline-offset-2"
              title="View industries"
              onClick={() => {
                setIndustriesDialogOpen(true);
                fetchCompanyIndustries(id);
              }}
            >
              {industriesCount}{" "}
              {industriesCount > 1 ? "Industries" : "Industry"}
            </button>
          </div>
        </div>

        <p className="text-black break-words">{overview}</p>
      </div>

      <InfoDialog
        header={`${name} Industries`}
        isOpen={isIndustriesDialogOpen}
        data={industries}
        onClose={() => setIndustriesDialogOpen(false)}
      />
      <InfoDialog
        header={`${name} Locations`}
        isOpen={isLocationsDialogOpen}
        data={locations.map(
          ({ country, city }) => `${country}${city ? `, ${city}` : ""}`
        )}
        onClose={() => setLocationsDialogOpen(false)}
      />
    </>
  );
};

export default CompanyCard;
