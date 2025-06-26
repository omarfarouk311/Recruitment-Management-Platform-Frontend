import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import type { Experience } from "../../../types/profile";
import { useEffect } from "react";
import LocationSearch from "../../common/LocationSearch";
import { format } from "date-fns";

// Zod schema for validation
const schema = z.object({
  companyName: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

interface ExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience;
  updateExperience: (experience: Experience) => Promise<void> | void;
  addExperience: (experience: Experience) => Promise<void> | void;
}

export default function ExperienceDialog({
  isOpen,
  onClose,
  experience,
  updateExperience,
  addExperience,
}: ExperienceDialogProps) {
  const defaultFormValues = {
    companyName: "",
    position: "",
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
  });

  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  useEffect(() => {
    if (experience) {
      // Convert stored dates from MMM yyyy to yyyy-MM format
      const formatForInput = (dateString: string) => {
        try {
          return format(new Date(dateString).toISOString(), "yyyy-MM");
        } catch {
          return dateString;
        }
      };

      reset({
        ...defaultFormValues,
        ...experience,
        startDate: formatForInput(experience.startDate),
        endDate: experience.endDate ? formatForInput(experience.endDate) : undefined,
      });
    } else {
      reset(
        experience || {
          companyName: "",
          position: "",
          country: "",
          city: "",
          startDate: "",
          endDate: "",
          description: "",
        }
      );
    }
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();

    if(data.endDate === "") delete data.endDate;

    const [startYear, startMonth] = data.startDate.split("-").map(Number);
    const [endYear, endMonth] = data.endDate? data.endDate.split("-").map(Number): [undefined, undefined];
    const isDateValid = (!endYear || startYear < endYear) || (startYear === endYear && startMonth <= endMonth!);

    if (!isValid || !isDateValid) {
      if (!isDateValid) {
        setError("endDate", {
          type: "manual",
          message: "End date must be after the start date",
        });
      }
      return;
    }

    if (experience)
      await updateExperience({
        ...data,
        id: experience.id,
      });
    else await addExperience(data);

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
          <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{experience ? "Edit Experience" : "Add Experience"}</h2>
              <button onClick={onClose} className="hover:bg-gray-200 rounded-full p-2 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                e.stopPropagation(); // Stop event bubbling
                handleSubmit(onSubmit)(e); // Trigger form validation
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  {...register("companyName")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.companyName ? "border-red-500" : ""
                  }`}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  {...register("position")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.position ? "border-red-500" : ""
                  }`}
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex space-x-6">
                  <LocationSearch
                    selectedCountry={selectedCountry}
                    onCountryChange={(value) => {
                      setValue("country", value, { shouldValidate: true });
                      setValue("city", "", { shouldValidate: true });
                    }}
                    selectedCity={selectedCity}
                    onCityChange={(value) => setValue("city", value, { shouldValidate: true })}
                  />
                </div>

                <div className="flex space-x-6">
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="month"
                    {...register("startDate")}
                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <div>
                      <input
                        type="month"
                        {...register("endDate")}
                        className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                          errors.endDate ? "border-red-500" : ""
                        }`}
                        disabled={watch("endDate") === undefined}
                      />
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={watch("endDate") === undefined}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Set endDate to undefined (Present)
                              setValue("endDate", undefined, { shouldValidate: true });
                            } else {
                              // Set endDate to empty string to allow editing
                              setValue("endDate", "", { shouldValidate: true });
                            }
                          }}
                        />
                        <label>Present</label>
                      </div>
                    </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register("description")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="submit" variant="primary" className="!w-[30%] !h-10" loading={isSubmitting}>
                  {experience ? "Update" : "Add"} Experience
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
