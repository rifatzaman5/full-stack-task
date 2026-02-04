'use client';

import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CreateProjectInput } from '@/types';

interface ProjectFormProps {
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  initialData?: Partial<CreateProjectInput>;
  onClose?: () => void;
}

export default function ProjectForm({ onSubmit, initialData, onClose }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProjectInput>({
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: CreateProjectInput) => {
    await onSubmit(data);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        placeholder="Enter project name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Project name is required',
        })}
      />
      
      <Input
        label="Description"
        placeholder="Enter project description"
        error={errors.description?.message}
        {...register('description')}
      />
      
      <Input
        label="Billing Rate ($/hr)"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter billing rate"
        error={errors.billingRate?.message}
        {...register('billingRate', {
          required: 'Billing rate is required',
          valueAsNumber: true,
          min: { value: 0, message: 'Billing rate must be positive' },
        })}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData?.name ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
