'use client';

import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CreateTimeLogInput } from '@/types';

interface TimeLogFormProps {
  projectId: string;
  onSubmit: (data: CreateTimeLogInput) => Promise<void>;
  onClose?: () => void;
}

export default function TimeLogForm({ projectId, onSubmit, onClose }: TimeLogFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTimeLogInput>({
    defaultValues: {
      projectId,
      status: 'TODO',
    },
  });

  const handleFormSubmit = async (data: CreateTimeLogInput) => {
    await onSubmit({ ...data, projectId });
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Hours"
        type="number"
        step="0.5"
        min="0.5"
        max="12"
        placeholder="Enter hours (0.5 - 12)"
        error={errors.hours?.message}
        {...register('hours', {
          required: 'Hours are required',
          valueAsNumber: true,
          min: { value: 0.5, message: 'Minimum 0.5 hours' },
          max: { value: 12, message: 'Maximum 12 hours' },
        })}
      />
      
      <Input
        label="Date"
        type="date"
        error={errors.logDate?.message}
        {...register('logDate', {
          required: 'Date is required',
        })}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          {...register('status')}
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          rows={3}
          placeholder="Enter notes"
          {...register('notes')}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Log Time
        </Button>
      </div>
    </form>
  );
}
