import type { IData } from '../types';
import { StatsCard } from './StatsCard';
import { ChannelCard } from './ChannelCard';
import React from 'react';

interface DashboardProps {
  data: IData | null;
}

export function Dashboard({ data }: DashboardProps) {
  const totalSubscribers = data?.channels.reduce(
    (sum, channel) => sum + channel.subscribers.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Channels" value={data ? data.channels.length : 0} />
        <StatsCard
          title="Total Subscribers"
          value={totalSubscribers? totalSubscribers.toLocaleString() : 0}
        />
        <StatsCard
          title="Average Subscribers"
          value={totalSubscribers && data ? Math.round(totalSubscribers / data.channels.length).toLocaleString() : "NaN"}
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6">Managed Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data ? data.channels.map((channel) => (
          <ChannelCard key={channel.title} channel={channel} />
        )) : ''}
      </div>
    </div>
  );
}