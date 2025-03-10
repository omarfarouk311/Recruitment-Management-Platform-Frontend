import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import Button from '../ui/Button';
import  useStore from '../../../stores/globalStore';
import type { Experience } from '../../../types/profile';

// Zod schema for validation
const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: () => void;
}

export default function ExperienceForm({ experience, onSubmit }: ExperienceFormProps) {
  
  const addExperience = useStore.useSeekerProfileAddExperience();
  const updateExperience = useStore.useSeekerProfileUpdateExperience();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: experience || {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      logo: '',
    },
    mode: 'onChange', // Validate on every change
  });

  const onSubmitForm = (data: FormData) => {
    if (experience) {
      // Update existing experience
      updateExperience({ ...data, id: experience.id });
    } else {
      // Add new experience
      addExperience({ ...data, id: crypto.randomUUID() });
    }
    onSubmit(); // Close the form
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          {...register('company')}
          className={errors.company ? 'border-red-500' : ''}
        />
        {errors.company && (
          <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          {...register('position')}
          className={errors.position ? 'border-red-500' : ''}
        />
        {errors.position && (
          <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <input
            type="month"
            id="startDate"
            {...register('startDate')}
            className={`w-full p-2 border rounded ${
              errors.startDate ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <input
            type="month"
            id="endDate"
            {...register('endDate')}
            className={`w-full p-2 border rounded ${
              errors.endDate ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className={`flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="logo">Logo URL (optional)</Label>
        <Input id="logo" {...register('logo')} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid} // Disable the button if the form is invalid
        >
          {experience ? 'Update' : 'Add'} Experience
        </Button>
      </div>
    </form>
  );
}