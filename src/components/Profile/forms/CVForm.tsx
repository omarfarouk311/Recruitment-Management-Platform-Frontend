import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/Label";
import Button from "../ui/Button";
import type { CV } from "../../../types/profile.ts";
import  useStore from '../../../stores/globalStore';

const schema = z.object({
  name: z.string().min(1, "File is required"), // Name will be derived from the uploaded file
});

type FormData = z.infer<typeof schema>;

interface CVFormProps {
  cv?: CV;
  onSubmit: () => void;
}

export default function CVForm({ cv, onSubmit }: CVFormProps) {

  const addCV = useStore.useSeekerProfileAddCV();
  const updateCV = useStore.useSeekerProfileUpdateCV();

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: cv || { name: "" },
    mode: "onChange",
  });

  const onSubmitForm = (data: FormData) => {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (cv) {
      updateCV({ ...data, id: cv.id, date });
    } else {
      addCV({ ...data, id: crypto.randomUUID(), date });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="file">Upload CV</Label>
        <input
          type="file"
          id="file"
          accept=".pdf,.doc,.docx" // Restrict to specific file types
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // Set the CV name to the uploaded file's name
              setValue("name", file.name, { shouldValidate: true });
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" variant="primary" disabled={!isValid}>
          {cv ? "Update" : "Add"} CV
        </Button>
      </div>
    </form>
  );
}