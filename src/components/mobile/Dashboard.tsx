import React from 'react';
import type { IData } from '../../types';
import { StatsCard } from './StatsCard';
import { ChannelCard } from './ChannelCard';

interface DashboardProps {
  data: IData;
}

export function Dashboard({ data }: DashboardProps) {
  const totalSubscribers = data.channels.reduce(
    (sum, channel) => sum + channel.subscribers.length,
    0
  );

  return (
    <div className="p-3 space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <StatsCard title="Channels" value={data.channels.length} />
        <StatsCard
          title="Subscribers"
          value={totalSubscribers.toLocaleString()}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Your Channels
        </h2>
        <div className="space-y-4">
          {data.channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
}