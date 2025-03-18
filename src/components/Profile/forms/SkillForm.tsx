import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";

const schema = z.object({
  name: z.string().min(1, "Skill name is required"),
});

type FormData = z.infer<typeof schema>;

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillDialog({ isOpen, onClose }: SkillDialogProps) {
  const addSkill = useStore.useSeekerProfileAddSkill();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({ name: "" });
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSubmitting(true);

    await addSkill(data);

    onClose();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Add Skill</h2>
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
                  Skill Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter skill name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-[130px]"
                  loading={isSubmitting}
                >
                  Add Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
