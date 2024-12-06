import React from 'react';
import { ChannelSubscribers } from '../components/mobile/ChannelSubscribers';
import type { AdminData } from '../types';

interface SubscribersPageProps {
  data: AdminData;
  onUpdateSubscriber: (id: string, status: 'active' | 'expired' | 'free') => void;
  onBanUser: (channelTitle: string, userId: string) => void;
  onBulkUpdateRoles: (userIds: string[], role: "admin" | "subscriber") => void;
  onUpdateUserRole: (userId: string, role: "admin" | "subscriber") => void;
}

export function SubscribersPage(props: SubscribersPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Channel Subscribers</h1>
      <div className="space-y-6">
        {props.data.channels.map((channel) => (
          <ChannelSubscribers
            key={channel.title}
            data={props.data}
            onUpdateSubscriber={props.onUpdateSubscriber}
            onBanUser={props.onBanUser}
            onBulkUpdateRoles={props.onBulkUpdateRoles}
            onUpdateUserRole={props.onUpdateUserRole}
          />
        ))}
      </div>
    </div>
  );
}