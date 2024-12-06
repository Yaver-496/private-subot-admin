import React from 'react';
import { format } from 'date-fns';
import { ChevronDown, Shield } from 'lucide-react';
import type { User } from '../../types';
import WebApp from '@twa-dev/sdk';

interface AdminListProps {
  admins: User[];
  selectedUsers: string[];
  onSelectUser: (id: string) => void;
  onDemoteToSubscriber: (id: string) => void;
}

export function AdminList({
  admins,
  selectedUsers,
  onSelectUser,
  onDemoteToSubscriber
}: AdminListProps) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof User;
    direction: 'asc' | 'desc';
  }>({ key: 'username', direction: 'asc' });

  const sortedAdmins = [...admins].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof User) => {
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
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === admins.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectUser(admins.map(admin => admin.id).join(','));
                    } else {
                      onSelectUser('');
                    }
                  }}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
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
                onClick={() => handleSort('joinDate')}
              >
                <div className="flex items-center gap-1">
                  Join Date
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(admin.id)}
                    onChange={() => onSelectUser(admin.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-telegram-blue" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      @{admin.username}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(admin.joinDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDemoteToSubscriber(admin.id)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Demote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}