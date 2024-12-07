/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { MobileHeader } from './components/mobile/MobileHeader';
import { BottomNav } from './components/mobile/BottomNav';
import { Dashboard } from './components/mobile/Dashboard';
import { ChannelSubscribers } from './components/mobile/ChannelSubscribers';
import { PlansPage } from './pages/PlansPage';
import { MoneyPage } from './pages/MoneyPage';
import type { IData, IMember, SubscriptionPlan } from './types';

function App() {
  const { isDataPending, isReady, userData } = useTelegramWebApp();
  const [data, setData] = React.useState<IData>(userData);
  
  useEffect(() => {

    setData(userData!!);

  }, [userData]);

  const handleUpdateSubscriber = (channelID: number, id: number, status: 'active' | 'expired' | 'free') => {
    setData(prev => ({
      ...prev,
      users: prev.channels[channelID].subscribers.map(member =>
        member.id === id ? { ...member, subscriptionStatus: status } : member
      )
    }));
  };

  const handleBanUser = (channelID: number, userId: number) => {
    setData(prev => ({
      ...prev,
      users: prev.channels[channelID].subscribers.map(member =>
        member.id === userId
          ? {
              ...member,
              subscriptionStatus: 'expired'
            }
          : member
      )
    }));
  };

  const handleUpdateUserRole = (channelID: number, userId: number, role: 'admin' | 'subscriber' | 'banned') => {
    setData(prev => ({
      ...prev,
      users: prev.channels[channelID].subscribers.map(member =>
        member.id === userId ? { ...member, role } : member
      )
    }));
  };

  if(isDataPending) {
    return <h1 className='text-3xl text-center my-8 font-bold text-gray-400'>Loading...</h1>
  }

  if (!isReady) {
    return null;
  }

  return (
    <TonConnectUIProvider manifestUrl="https://yaver-496.github.io/IA-Entertainment-Dapp/tonconnect-manifest.json">
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 dark:text-white">
          <Routes>
            <Route path="/" element={
              <>
                <MobileHeader username={userData!!.username} title="Private Subot Admin" />
                <Dashboard data={userData!!} />
              </>
            } />
            <Route path="/channel/:channelTitle" element={
              <>
                <MobileHeader title="Channel Subscribers" username={null} />
                <ChannelSubscribers
                  data={data}
                  onUpdateSubscriber={handleUpdateSubscriber}
                  onBanUser={handleBanUser}
                  onUpdateUserRole={handleUpdateUserRole}
                />
              </>
            } />
            <Route path="/plans" element={
              <>
                <MobileHeader title="Subscription Plans" username={null} />
              </>
            } />
            <Route path="/money" element={
              <>
                <MobileHeader title="Money Management" username={null} />
                <MoneyPage />
              </>
            } />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}

export default App;