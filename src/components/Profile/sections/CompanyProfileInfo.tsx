import { Star, Settings, Edit } from "lucide-react";
import InfoDialog from "../../common/InfoDialog";
import Button from "../../common/Button";
import { useState, useEffect } from "react";
import useStore from "../../../stores/globalStore";
import type { CompanyProfileInfo } from "../../../types/profile";
import CredentialsDialog from "../../common/AccountSettingDialog";
import EditProfileDialog from "../forms/EditCompanyProfileForm";
import { useParams } from "react-router-dom";
import { UserRole } from "../../../stores/User Slices/userSlice";

export function CompanyProfileInfo() {
  const profileInfo = useStore.useCompanyProfileInfo();
  const userId = useStore.useUserId();
  const [imageError, setImageError] = useState(false);
  const { id: companyId } = useParams();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);
  const userRole = useStore.useUserRole();
  const credentials = useStore.useCompanyCredentials();
  const fetchEmail = useStore.useCompanyProfileFetchEmail();
  const fetchCompanyInfo = useStore.useCompanyProfileFetchInfo();
  const fetchCompanyIndustries = useStore.useCompanyProfileFetchIndustries();
  const fetchCompanyLocations = useStore.useCompanyProfileFetchLocations();
  const updateCredentials = useStore.useCompanyProfileUpdateCredentials();

  useEffect(() => {
    // Reset error state when image URL changes
    setImageError(false);
  }, [profileInfo.image]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCompanyInfo(companyId);
      fetchCompanyIndustries(companyId);
      fetchCompanyLocations(companyId);
    };
    fetchData();
    if (userRole === UserRole.COMPANY && userId === profileInfo.id) fetchEmail();
  }, [companyId]);

  const [isIndustriesDialogOpen, setIndustriesDialogOpen] = useState(false);
  const [isLocationsDialogOpen, setLocationsDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 space-y-6 border-2 border-gray-200 shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 flex items-center justify-center">
            {!imageError && profileInfo.image ? (
              <img
                src={profileInfo.image as string}
                onError={() => setImageError(true)}
                alt="Profile Image"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xl text-gray-500">{profileInfo.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center gap-4">
            <h3 className="text-2xl font-bold">{profileInfo.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-semibold text-lg">{profileInfo.rating}</span>
              <Star className="h-4 w-4 fill-current text-yellow-400" />
            </div>
          </div>
        </div>

        {userRole === UserRole.COMPANY && userId === profileInfo.id && (
          <div className="flex gap-8 ml-auto">
            <Button
              variant="outline"
              className="w-[150px] !py-1"
              onClick={() => setIsAccountSettingsDialogOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>

            <Button
              variant="outline"
              className="w-[150px] !py-1"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      <div>
        <h1 className="font-bold text-2xl"> Overview </h1>
        <p className="text-black break-words">{profileInfo.overview}</p>
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
            }).format(profileInfo.jobsCount)}
          </div>
          <div className="text-black text-center font-semibold">Jobs</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(profileInfo.size)}
          </div>
          <div className="text-black text-center font-semibold">Size</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 1,
              maximumSignificantDigits: 3,
              signDisplay: "never",
            }).format(profileInfo.reviewsCount)}
          </div>
          <div className="text-black text-center font-semibold">Reviews</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">{profileInfo.foundedIn}</div>
          <div className="text-black text-center font-semibold">Founded In</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">{profileInfo.type}</div>
          <div className="text-black text-center font-semibold">Type</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            <button
              className="text-blue-500 hover:underline cursor-pointer underline-offset-2"
              title="View industries"
              onClick={() => {
                setIndustriesDialogOpen(true);
              }}
            >
              {profileInfo.industriesCount} {profileInfo.industriesCount > 1 ? "Industries" : "Industry"}
            </button>
          </div>
          <div className="text-black text-center font-semibold">Industries</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-black">
            <button
              className="text-blue-500 hover:underline cursor-pointer underline-offset-2"
              title="View locations"
              onClick={() => {
                setLocationsDialogOpen(true);
              }}
            >
              {profileInfo.locationsCount} {profileInfo.locationsCount > 1 ? "Locations" : "Location"}
            </button>
          </div>
          <div className="text-black text-center font-semibold">Locations</div>
        </div>
      </div>

      <InfoDialog
        header={`${profileInfo.name} Industries`}
        isOpen={isIndustriesDialogOpen}
        data={profileInfo.industries.map(({ name }) => name)}
        onClose={() => setIndustriesDialogOpen(false)}
      />
      <InfoDialog
        header={`${profileInfo.name} Locations`}
        isOpen={isLocationsDialogOpen}
        data={profileInfo.locations.map(({ country, city }) => `${country}${city ? `, ${city}` : ""}`)}
        onClose={() => setLocationsDialogOpen(false)}
      />
      {userRole === UserRole.COMPANY && userId === profileInfo.id && (
        <>
          <EditProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
            profileInfo={profileInfo}
          />
          <CredentialsDialog
            isOpen={isAccountSettingsDialogOpen}
            onClose={() => setIsAccountSettingsDialogOpen(false)}
            credentials={credentials}
            updateCredentials={updateCredentials}
          />
        </>
      )}
    </div>
  );
}
