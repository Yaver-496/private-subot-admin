import { ExternalLink, Users } from 'lucide-react';
import type { IChannel } from '../types';
import React from 'react';

interface ChannelCardProps {
  channel: IChannel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{channel.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{channel.subscribers.toLocaleString()} subscribers</span>
          </div>
        </div>
        <a
          href={channel.inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0088cc] hover:text-[#006699] transition-colors"
        >
          <ExternalLink className="w-5 h-9 flex items-center" />
          <a>{channel.inviteLink}</a>
        </a>
      </div>
    </div>
  );
}