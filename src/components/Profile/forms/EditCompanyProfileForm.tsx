import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button.tsx";
import { XCircle, Upload, X } from "lucide-react";
import type { CompanyProfileInfo } from "../../../types/profile.ts";
import useStore from "../../../stores/globalStore.ts";
import LocationSearch from "../../common/LocationSearch.tsx";
import FilterDropdown from "../../Filters/FilterDropdown.tsx";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  overview: z.string().min(1, "Overview is required"),
  foundedIn: z.number().min(1800, "Invalid year").max(new Date().getFullYear(), "Year cannot be in future"),
  size: z.number().min(1, "Size must be at least 1"),
  type: z.enum(["Public", "Private"], {
    required_error: "Company type is required",
    invalid_type_error: "Company type must be Public or Private",
  }),
  image: z.union([z.string(), z.instanceof(File).refine((file) => file.size > 0, "Image is required")]),
  locations: z
    .array(
      z.object({
        country: z.string(),
        city: z.string(),
      })
    )
    .min(1, "At least one location is required"),
  industries: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(1, "At least one industry is required"),
});

type FormData = z.infer<typeof schema>;

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileInfo: CompanyProfileInfo;
}

const CompanyProfileDialog = ({ isOpen, onClose, profileInfo }: ProfileDialogProps) => {
  const updateProfile = useStore.useCompanyProfileUpdateInfo();
  const [tempCountry, setTempCountry] = useState("");
  const fetchIndustryOptions = useStore.useSharedEntitiesSetIndustryOptions();
  const industryOptions = useStore.useSharedEntitiesIndustryOptions();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profileInfo.image]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...profileInfo,
      type: profileInfo.type as "Public" | "Private",
    },
    mode: "onSubmit",
  });

  const image = watch("image");
  const locations = watch("locations");
  const industries = watch("industries");

  useEffect(() => {
    fetchIndustryOptions();
  }, []);

  useEffect(() => {
    reset({
      ...profileInfo,
      type: profileInfo.type as "Public" | "Private",
    });
  }, [isOpen]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", file, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    await updateProfile({
      ...profileInfo,
      ...data,
    });
    onClose();
    window.location.reload();
  };

  const addLocation = (city: string) => {
    if (!tempCountry || !city || locations.some((loc) => loc.country === tempCountry && loc.city === city)) {
      return;
    }

    setValue("locations", [...locations, { country: tempCountry, city }]);
    setTempCountry("");
  };

  const removeLocation = (index: number) => {
    setValue(
      "locations",
      locations.filter((_, i) => i !== index)
    );
  };

  const addIndustry = (value: string) => {
    const industry = industryOptions.find((opt) => opt.value === value);
    if (!industry || industries.some((ind) => ind.id === parseInt(industry.value))) return;
    setValue("industries", [...industries, { id: parseInt(industry.value), name: industry.label }]);
  };

  const removeIndustry = (industryId: number) => {
    setValue(
      "industries",
      industries.filter((ind) => ind.id !== industryId)
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
          <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Edit Company Profile</h2>
              <button onClick={onClose} className="hover:bg-gray-200 rounded-full p-2 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  {image instanceof File ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={profileInfo.name}
                      className="w-36 h-36 rounded-full object-cover"
                    />
                  ) : image && !imageError ? (
                    <img
                      src={image as string}
                      alt={profileInfo.name}
                      className="w-36 h-36 rounded-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="w-36 h-36 text-4xl text-gray-400 flex items-center justify-center">
                      {profileInfo.name.charAt(0)}
                    </span>
                  )}
                </div>

                <label className="cursor-pointer flex items-center gap-2 text-blue-500">
                  <Upload className="w-4 h-4" />
                  <span>Change Picture</span>
                  <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
                </label>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full p-3 border rounded-xl ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Overview</label>
                <textarea
                  {...register("overview")}
                  className={`w-full p-3 border rounded-xl h-32 ${
                    errors.overview ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>}
              </div>

              {/* Founded In */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Founded In</label>
                <input
                  type="number"
                  {...register("foundedIn", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-xl ${
                    errors.foundedIn ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.foundedIn && <p className="text-red-500 text-sm mt-1">{errors.foundedIn.message}</p>}
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Size</label>
                <input
                  type="number"
                  {...register("size", { valueAsNumber: true })}
                  className={`w-full p-3 border rounded-xl ${
                    errors.size ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Type</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Public"
                      {...register("type")}
                      checked={watch("type") === "Public"}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm">Public</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Private"
                      {...register("type")}
                      checked={watch("type") === "Private"}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm">Private</span>
                  </label>
                </div>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>

              {/* Locations Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Locations</label>
                <div className="flex gap-16">
                  <LocationSearch
                    selectedCountry={tempCountry}
                    onCountryChange={setTempCountry}
                    selectedCity={""}
                    onCityChange={addLocation}
                  />
                </div>

                {/* Location Chips */}
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1">
                      <span className="text-sm">
                        {loc.country}, {loc.city}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations.message}</p>}
              </div>

              {/* Industries Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Industries</label>
                <FilterDropdown
                  label="Select Industries"
                  options={industryOptions}
                  onSelect={addIndustry}
                  selectedValue=""
                  addAnyOption={false}
                  className="!w-[40%]"
                />

                {/* Industry Chips */}
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <div
                      key={industry.id}
                      className="inline-flex items-center bg-gray-100 rounded-2xl px-4 py-1"
                    >
                      <span className="text-sm">{industry.name}</span>
                      <button
                        type="button"
                        onClick={() => removeIndustry(industry.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.industries && (
                  <p className="text-red-500 text-sm mt-1">{errors.industries.message}</p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="submit" variant="primary" className="!w-[30%] !h-10" loading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CompanyProfileDialog;
