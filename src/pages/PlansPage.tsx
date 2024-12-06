import React from 'react';
import { SubscriptionPlanList } from '../components/mobile/SubscriptionPlanList';
import type { AdminData, SubscriptionPlan } from '../types';

interface PlansPageProps {
  data: AdminData;
  onAddPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  onUpdatePlan: (id: string, plan: Omit<SubscriptionPlan, 'id'>) => void;
  onDeletePlan: (id: string) => void;
}

export function PlansPage({ 
  data, 
  onAddPlan, 
  onUpdatePlan,
  onDeletePlan 
}: PlansPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionPlanList
        plans={data.subscriptionPlans}
        onAddPlan={onAddPlan}
        onUpdatePlan={onUpdatePlan}
        onDeletePlan={onDeletePlan}
      />
    </div>
  );
}