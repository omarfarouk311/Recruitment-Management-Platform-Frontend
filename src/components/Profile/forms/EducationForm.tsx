import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";
import type { Education } from "../../../types/profile";
import { format, parse } from "date-fns";

const schema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  grade: z.string().min(1, "Grade is required"),
});

type FormData = z.infer<typeof schema>;

interface EducationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  education?: Education;
  addEducation: (education: Education) => Promise<void> | void;
  updateEducation: (education: Education) => Promise<void> | void;
}

export default function EducationDialog({
  isOpen,
  onClose,
  education,
  addEducation,
  updateEducation,
}: EducationDialogProps) {

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
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (education) {
      // Convert stored dates from MMM yyyy to yyyy-MM format
      const formatForInput = (dateString: string) => {
        return format(parse(dateString, "MMM yyyy", new Date()), "yyyy-MM");
      };

      reset({
        ...education,
        startDate: formatForInput(education.startDate),
        endDate: formatForInput(education.endDate),
      });
    } else {
      reset({
        institution: "",
        fieldOfStudy: "",
        degree: "",
        startDate: "",
        endDate: "",
        grade: "",
      });
    }
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
      await updateEducation({
        ...data,
        id: education.id,
      });
    } else await addEducation(data);

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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Field Of Study
                </label>
                <input
                  type="text"
                  {...register("fieldOfStudy")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.fieldOfStudy ? "border-red-500" : ""
                  }`}
                />
                {errors.fieldOfStudy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fieldOfStudy.message}
                  </p>
                )}
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
                <Button
                  type="submit"
                  variant="primary"
                  className="!w-[30%] !h-10"
                  loading={isSubmitting}
                >
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
