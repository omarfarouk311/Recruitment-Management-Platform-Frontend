import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import Button from '../ui/Button';
import  useStore from '../../../stores/globalStore';
import type { Education } from '../../../types/profile.ts';

const schema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  gpa: z.string().min(1, 'GPA is required'),
  logo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EducationFormProps {
  education?: Education;
  onSubmit: () => void;
}

export default function EducationForm({ education, onSubmit }: EducationFormProps) {

  const addEducation = useStore.useSeekerProfileAddEducation();
  const updateEducation = useStore.useSeekerProfileUpdateEducation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: education || {
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      logo: '',
    },
    mode: 'onChange',
  });

  const onSubmitForm = (data: FormData) => {
    if (education) {
      updateEducation({ ...data, id: education.id });
    } else {
      addEducation({ ...data, id: crypto.randomUUID() });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          {...register('institution')}
          className={errors.institution ? 'border-red-500' : ''}
        />
        {errors.institution && (
          <p className="text-red-500 text-sm mt-1">{errors.institution.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          {...register('degree')}
          className={errors.degree ? 'border-red-500' : ''}
        />
        {errors.degree && (
          <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
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
            className={`w-full p-2 border rounded ${errors.startDate ? 'border-red-500' : 'border-gray-200'}`}
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
            className={`w-full p-2 border rounded ${errors.endDate ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="gpa">GPA</Label>
        <Input
          id="gpa"
          {...register('gpa')}
          className={errors.gpa ? 'border-red-500' : ''}
        />
        {errors.gpa && (
          <p className="text-red-500 text-sm mt-1">{errors.gpa.message}</p>
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
          disabled={!isValid}
        >
          {education ? 'Update' : 'Add'} Education
        </Button>
      </div>
    </form>
  );
}