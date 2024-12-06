import React from 'react';
import { format } from 'date-fns';
import { ChevronDown, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import type { IMember } from '../../types';
import WebApp from '@twa-dev/sdk';

interface SubscriberListProps {
  subscribers: IMember[];
  onUpdateStatus: (id: number, status: 'active' | 'expired' | 'free') => void;
  onBanUser: (id: number) => void;
  onPromoteToAdmin: (id: number) => void;
}

export function SubscriberList({
  subscribers,
  onUpdateStatus,
  onBanUser,
  onPromoteToAdmin
}: SubscriberListProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof IMember;
    direction: 'asc' | 'desc';
  }>({ key: 'username', direction: 'asc' });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'free':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const sortedSubscribers = [...subscribers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof IMember) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center gap-1">
                  Username
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('substate')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('enddate')}
              >
                <div className="flex items-center gap-1">
                  Expires
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedSubscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                {/* <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(subscriber)}
                    onChange={() => onSelectUser(subscriber)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td> */}
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    @{subscriber.username}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(subscriber.role)}
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {subscriber.role}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(Number.parseInt(subscriber.enddate)), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={subscriber.substate}
                      onChange={(e) => onUpdateStatus(
                        
                        subscriber.id,
                        e.target.value as 'active' | 'expired' | 'free'
                      )}
                      className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="free">Free</option>
                    </select>
                    <button
                      onClick={() => onPromoteToAdmin(subscriber.id)}
                      className="p-1 text-telegram-blue hover:text-telegram-hover"
                      title="Promote to Admin"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onBanUser(subscriber.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}