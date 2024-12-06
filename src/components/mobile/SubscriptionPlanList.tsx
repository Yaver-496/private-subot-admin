import React from 'react';
import { Plus, Pencil } from 'lucide-react';
import type { SubscriptionPlan } from '../../types';
import { Modal } from './Modal';
import { PlanForm } from './PlanForm';

interface SubscriptionPlanListProps {
  plans: SubscriptionPlan[];
  onAddPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  onUpdatePlan: (id: string, plan: Omit<SubscriptionPlan, 'id'>) => void;
  onDeletePlan: (id: string) => void;
}

export function SubscriptionPlanList({ 
  plans, 
  onAddPlan,
  onUpdatePlan,
  onDeletePlan 
}: SubscriptionPlanListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(null);

  const handleAddPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
    onAddPlan(plan);
    setIsAddModalOpen(false);
  };

  const handleUpdatePlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
    if (editingPlan) {
      onUpdatePlan(editingPlan.id, plan);
      setEditingPlan(null);
    }
  };

  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Subscription Plans</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-telegram-blue text-white rounded-lg hover:bg-telegram-hover transition-colors"
        >
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="dark:bg-black/90 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{plan.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="text-telegram-blue hover:text-telegram-hover"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-telegram-blue">
                ${plan.price}
                <span className="text-sm text-gray-500 dark:text-gray-200 font-normal">
                  /{plan.duration} month{plan.duration > 1 ? 's' : ''}
                </span>
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/50">
                  <span className="w-1.5 h-1.5 bg-telegram-blue rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plan"
      >
        <PlanForm
          onSubmit={handleAddPlan}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Edit Plan"
      >
        {editingPlan && (
          <PlanForm
            plan={editingPlan}
            onSubmit={handleUpdatePlan}
            onCancel={() => setEditingPlan(null)}
          />
        )}
      </Modal>
    </div>
  );
}