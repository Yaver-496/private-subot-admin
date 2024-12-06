import React from 'react';
import type { SubscriptionPlan } from '../../types';

interface PlanFormProps {
  plan?: SubscriptionPlan;
  onSubmit: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  onCancel: () => void;
}

export function PlanForm({ plan, onSubmit, onCancel }: PlanFormProps) {
  const [formData, setFormData] = React.useState({
    name: plan?.name ?? '',
    duration: plan?.duration ?? null,
    price: plan?.price ?? null,
    features: plan?.features.join('\n') ?? '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.duration === null) newErrors.duration = 'Duration must be at least 1 month';
    if (formData.price && formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.features.trim()) newErrors.features = 'At least one feature is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name: formData.name,
        duration: formData.duration!!,
        price: formData.price!!,
        features: formData.features.split('\n').filter(f => f.trim()),
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-telegram-blue focus:ring-telegram-blue"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Duration (months)
        </label>
        <input
          type="number"
          min='1'
          value={formData.duration ? formData.duration : ''}
          onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-telegram-blue focus:ring-telegram-blue"
        />
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price ($)</label>
        <input
          type="number"
          step="0.01"
          min='0.01'
        
          value={formData.price ? formData.price : ''}
          onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-telegram-blue focus:ring-telegram-blue"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Features (one per line)
        </label>
        <textarea
          value={formData.features}
          onChange={e => setFormData(prev => ({ ...prev, features: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-telegram-blue focus:ring-telegram-blue"
        />
        {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-telegram-blue rounded-md hover:bg-telegram-hover"
        >
          Save
        </button>
      </div>
    </form>
  );
}