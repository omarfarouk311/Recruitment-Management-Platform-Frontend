import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";

const schema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, "Image is required"),
});

type FormData = z.infer<typeof schema>;

interface CVDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVDialog({ isOpen, onClose }: CVDialogProps) {
  const addCV = useStore.useSeekerProfileAddCV();
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({ file: undefined });
    setShowLimitMessage(false);
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();
    if (!isValid) return;

    const createdAt = new Date().toISOString();

    try {
      await addCV(data.file, createdAt);
      onClose();
    } catch (err: any) {
      if (err.status === 409) {
        setShowLimitMessage(true);
        setTimeout(() => {
          onClose();
          setShowLimitMessage(false);
        }, 2000);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl">
          <div className="p-8">
            {showLimitMessage ? (
              <div className="text-center py-8 min-h-[200px] flex flex-col justify-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">CV Limit Reached</h3>
                <p className="text-gray-600">You can only have up to 5 CVs.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Add CV</h2>
                  <button
                    onClick={onClose}
                    className="hover:bg-gray-200 rounded-full p-2 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("file", file, { shouldValidate: true });
                      }
                    }}
                    className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.file ? "border-red-500" : ""
                    } file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-500 hover:file:text-black hover:file:cursor-pointer`}
                  />

                  {errors.file && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.file.message}
                    </p>
                  )}

                  <div className="mt-8 flex justify-end gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="!w-[30%] !h-10"
                      loading={isSubmitting}
                    >
                      Add CV
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
