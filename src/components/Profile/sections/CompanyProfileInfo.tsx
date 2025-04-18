import { Star } from "lucide-react";
import InfoDialog from "../../common/InfoDialog";
import { useState } from "react";
import { mockCompanyProfileInfo } from "../../../mock data/companyProfile";
import useStore from "../../../stores/globalStore";

export function CompanyProfileInfo() {
  const {
    id,
    foundedIn,
    industries,
    industriesCount,
    jobsCount,
    locations,
    locationsCount,
    name,
    overview,
    rating,
    reviewsCount,
    size,
    type,
    image,
  } = mockCompanyProfileInfo;

  const [isIndustriesDialogOpen, setIndustriesDialogOpen] = useState(false);
  const [isLocationsDialogOpen, setLocationsDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 space-y-6 border-2 border-gray">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 flex items-center justify-center">
            {image ? (
              <img src={image} />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xl text-gray-500">{name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center gap-4">
            <h3 className="text-2xl font-bold">{name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-semibold text-lg">{rating}</span>
              <Star className="h-4 w-4 fill-current text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-2xl"> Overview </h1>
        <p className="text-black break-words">{overview}</p>
      </div>

      <div className="flex space-x-16">
        <div className="text-center">
          <div className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(jobsCount)}
          </div>
          <div className="text-black text-center font-semibold">
            Jobs
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(size)}
          </div>
          <div className="text-black text-center font-semibold">
            Size
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(reviewsCount)}
          </div>
          <div className="text-black text-center font-semibold">
            Reviews
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">{foundedIn}</div>
          <div className="text-black text-center font-semibold">
            Founded In
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">{type}</div>
          <div className="text-black text-center font-semibold">
            Type
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            <button
              className="text-blue-500 hover:underline cursor-pointer underline-offset-2"
              title="View industries"
              onClick={() => {
                setIndustriesDialogOpen(true);
                //fetchCompanyIndustries(id);
              }}
            >
              {industriesCount}{" "}
              {industriesCount > 1 ? "Industries" : "Industry"}
            </button>
          </div>
          <div className="text-black text-center font-semibold">
            Industries
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            <button
              className="text-blue-500 hover:underline cursor-pointer underline-offset-2"
              title="View locations"
              onClick={() => {
                setLocationsDialogOpen(true);
                //fetchCompanyLocations(id);
              }}
            >
              {locationsCount} {locationsCount > 1 ? "Locations" : "Location"}
            </button>
          </div>
          <div className="text-black text-center font-semibold">
            Locations
          </div>
        </div>
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
    </div>
  );
}
