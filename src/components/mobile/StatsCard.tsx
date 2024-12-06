import React from 'react';
import { Users } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="rounded-lg shadow-md p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-800 ">
      <div className="p-2 bg-[#0088cc]/10 rounded-full">
        <Users className="w-4 h-4 text-[#0088cc]" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-white/70">{title}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
}