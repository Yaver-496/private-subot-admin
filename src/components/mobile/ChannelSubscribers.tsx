import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from './Tabs';
import { SubscriberList } from './SubscriberList';
import type { IChannel, IData, IMember } from '../../types';
import WebApp from '@twa-dev/sdk';

interface ChannelSubscribersProps {
  data: IData;
  onUpdateSubscriber: (channelID: number, id: number, status: 'active' | 'expired' | 'free') => void;
  onBanUser: (channelID: number, userId: number) => void;
  onUpdateUserRole: (channelID: number, userId: number, role: 'admin' | 'subscriber' | 'banned') => void;
}

export function ChannelSubscribers({
  data,
  onUpdateSubscriber,
  onBanUser,
  onUpdateUserRole,
}: ChannelSubscribersProps) {


  const [channelID, setChannelID] = useState<number>();
  const [channel, setChannel] = useState<IChannel>();

  const [admins, setAdmins] = useState<IMember[]>([]);
  const [subscribers, setSubscribers] = useState<IMember[]>([]);
  const [bannedMembers, setBannedMembers] = useState<IMember[]>([]);

  const [channelMembersCount, setChannelMembersCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('subscribers');

  const params = useParams();

  useEffect(() => 
  {
    if(params.channelTitle)
    {
        const _channelID = Number.parseInt(params.channelTitle.toString());
        setChannelID(_channelID);
      
        if(_channelID) {

          const _channel = data.channels.find(c => c.id === _channelID);

          if(_channel)
          {
              setChannel(_channel);

              setAdmins(_channel.subscribers.filter(x => x.role === 'admin'));
              setSubscribers(_channel.subscribers.filter(x => x.role === 'subscriber'));
              setBannedMembers(_channel.subscribers.filter(x => x.role === 'banned'));

              setChannelMembersCount(_channel.subscribers.length);
              console.log("channel", _channel);
          }
        }
    }

  }, [useParams, params, params.channelTitle]);

  const filteredUsers = (users: IMember[]) => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (!channel) {
    return (
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400">Channel not found</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
      >
        <div className="flex items-center justify-between mb-4">
          <a className="text-lg font-semibold text-blue-800 dark:text-blue-400" href={channel.inviteLink}>
            {channel.title}
          </a>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {channelMembersCount} members
          </div>
        </div>
        
        <a className='text-sm text-blue-600 dark:text-blue-400'>{channel.inviteLink} </a>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>
    <div className="p-4 space-y-4">
      <Tabs selectedTab={selectedTab} onChange={setSelectedTab}>
        <Tab id="subscribers" label={`Subscribers (${subscribers.length})`}>
        <SubscriberList
            subscribers={filteredUsers(subscribers)}
            onUpdateStatus={ (id, status) => onUpdateSubscriber(channelID!!, id, status)}
            onBanUser={(userId) => onBanUser(channelID!!, userId)}
            onPromoteToAdmin={(userId) => {
              WebApp.showConfirm(
                'Are you sure you want to promote this user to admin?',
                (confirmed) => {
                  if (confirmed) {
                    onUpdateUserRole(channelID!!, userId, 'admin');
                    WebApp.showAlert('User promoted to admin successfully');
                  }
                }
              );
            }}
          />
        </Tab>
        <Tab id="admins" label={`Admins (${admins.length})`}>
          <></>
        </Tab>

        <Tab id="banned" label={`Banned (${bannedMembers.length})`}>
          <></>
        </Tab>

      </Tabs>
    </div>
    </>
  );
}


          {/* <SubscriberList
            subscribers={filteredUsers(subscribers)}
            selectedUsers={selectedUsers}
            onSelectUser={(id) => {
              setSelectedUsers(prev => 
                prev.includes(id) 
                  ? prev.filter(userId => userId !== id)
                  : [...prev, id]
              );
            }}
            onUpdateStatus={ (id, status) => onUpdateSubscriber(channelIndex, id, status)}
            onBanUser={(userId) => onBanUser(channelIndex, userId)}
            onPromoteToAdmin={(userId) => {
              WebApp.showConfirm(
                'Are you sure you want to promote this user to admin?',
                (confirmed) => {
                  if (confirmed) {
                    onUpdateUserRole(channelIndex, userId, 'admin');
                    WebApp.showAlert('User promoted to admin successfully');
                  }
                }
              );
            }}
          /> */}