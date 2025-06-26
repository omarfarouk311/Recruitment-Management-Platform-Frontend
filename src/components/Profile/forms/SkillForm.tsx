import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../common/Button";
import useStore from "../../../stores/globalStore";
import { Listbox } from '@headlessui/react';

const schema = z.object({
  id: z.preprocess((val) => parseInt(val as string), z.number({message: 'Skill not selected.'}).min(1, "Skill not selected."))
});

type FormData = z.infer<typeof schema>;

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addSkill: (skillId: number) => Promise<void> | void;
}

export default function SkillDialog({ isOpen, onClose, addSkill }: SkillDialogProps) {
  const skillOptions = useStore.useSeekerProfileSkillsFormData();
  const fetchOptions = useStore.useSeekerProfileFetchSkillsFormData();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({ id: undefined });
    if(isOpen)
      fetchOptions();
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();
    if (!isValid) return;
    if(data)
      await addSkill(data.id);
    onClose();
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

            <form 
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                e.stopPropagation(); // Stop event bubbling
                handleSubmit(onSubmit)(e); // Trigger form validation
              }} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Skill Name
                </label>
                <Listbox
                  value={watch('id')}
                  onChange={(value) => setValue('id', value)}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full p-3 text-left border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      {watch('id') ? skillOptions.find(o => o.id === watch('id'))?.name : 'Select a skill'}
                    </Listbox.Button>
                    
                    <Listbox.Options className="absolute w-full mt-1 max-h-48 overflow-auto rounded-xl bg-white shadow-lg border border-gray-200 z-10">
                      {skillOptions.map((skill) => (
                        <Listbox.Option
                          key={skill.id}
                          value={skill.id}
                          className={({ active }) => `p-3 cursor-pointer ${
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                          }`}
                        >
                          {skill.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">
                  {errors.id.message}
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
