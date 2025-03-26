import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../common/Button";
import type { Review } from "../../types/review";

const schema = z.object({
  role: z.string().min(1, "Role is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review?: Review;
  updateReview: (review: Review) => Promise<void>;
}

export default function ReviewForm({
  isOpen,
  onClose,
  review,
  updateReview,
}: ReviewDialogProps) {
  // add addReview hook when implemented

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: review?.role || "",
      rating: review?.rating || 5,
      description: review?.description || "",
    },
  });

  useEffect(() => {
    if (review) {
      reset({
        role: review.role,
        rating: review.rating,
        description: review.description,
      });
    }
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    if (review) {
      await updateReview({
        id: review.id,
        createdAt: review.createdAt,
        ...data,
      });
    } else {
      // add addReview hook when implemented
    }
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
                {review ? "Edit Review" : "Add Review"}
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
                  Role
                </label>
                <input
                  type="text"
                  {...register("role")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.role ? "border-red-500" : ""
                  }`}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rating
                </label>
                <select
                  {...register("rating", { valueAsNumber: true })}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.rating ? "border-red-500" : ""
                  }`}
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Stars
                    </option>
                  ))}
                </select>
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
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
                  {review ? "Update" : "Add"} Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
