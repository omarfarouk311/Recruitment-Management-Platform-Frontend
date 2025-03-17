import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";
import type { Education } from "../../../types/profile";
import LocationSearch from "../../common/LocationSearch";

const schema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  grade: z.string().min(1, "Grade is required"),
});

type FormData = z.infer<typeof schema>;

interface EducationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  education?: Education;
}

export default function EducationDialog({
  isOpen,
  onClose,
  education,
}: EducationDialogProps) {
  const addEducation = useStore.useSeekerProfileAddEducation();
  const updateEducation = useStore.useSeekerProfileUpdateEducation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: education ?? {
      institution: "",
      degree: "",
      country: "",
      city: "",
      startDate: "",
      endDate: "",
      grade: "",
    },
    mode: "onSubmit",
  });

  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  useEffect(() => {
    reset(
      education || {
        institution: "",
        degree: "",
        country: "",
        city: "",
        startDate: "",
        endDate: "",
        grade: "",
      }
    );
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();

    const [startYear, startMonth] = data.startDate.split("-").map(Number);
    const [endYear, endMonth] = data.endDate.split("-").map(Number);
    const isDateValid =
      startYear < endYear || (startYear === endYear && startMonth <= endMonth);

    if (!isValid || !isDateValid) {
      if (!isDateValid) {
        setError("endDate", {
          type: "manual",
          message: "End date must be after the start date",
        });
      }
      return;
    }

    if (education) {
      updateEducation({
        ...data,
        id: education.id,
      });
    } else addEducation(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl">
          <div className="p-8 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">
                {education ? "Edit Education" : "Add Education"}
              </h2>
              <button
                onClick={onClose}
                className="hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  {...register("institution")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.institution ? "border-red-500" : ""
                  }`}
                />
                {errors.institution && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.institution.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Degree
                </label>
                <input
                  type="text"
                  {...register("degree")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.degree ? "border-red-500" : ""
                  }`}
                />
                {errors.degree && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.degree.message}
                  </p>
                )}
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
                    onCityChange={(value) =>
                      setValue("city", value, { shouldValidate: true })
                    }
                  />
                </div>

                <div className="flex space-x-6">
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    {...register("startDate")}
                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="month"
                    {...register("endDate")}
                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Grade
                </label>
                <input
                  type="text"
                  {...register("grade")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.grade ? "border-red-500" : ""
                  }`}
                />
                {errors.grade && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.grade.message}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="submit" variant="primary" className="!w-auto">
                  {education ? "Update" : "Add"} Education
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
