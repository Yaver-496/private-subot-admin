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

const mockData: IData = {  
  id: 0,
  channels: [],
  language_code: '',
  username: 'username',
  subscriptionPlans: []
}

function App() {
  const { isDataPending, isReady, userData } = useTelegramWebApp();
  const [data, setData] = React.useState<IData>(userData ? userData : mockData);
  
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

  // const handleBulkUpdateRoles = (userIds: string[], role: 'admin' | 'subscriber') => {
  //   setData(prev => ({
  //     ...prev,
  //     users: prev.users.map(user =>
  //       userIds.includes(user.id) ? { ...user, role } : user
  //     )
  //   }));
  // };

  // const handleAddPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
  //   const newPlan = {
  //     ...plan,
  //     id: String(data.subscriptionPlans.length + 1),
  //   };
  //   setData(prev => ({
  //     ...prev,
  //     subscriptionPlans: [...prev.subscriptionPlans, newPlan]
  //   }));
  // };

  // const handleUpdatePlan = (id: string, updatedPlan: Omit<SubscriptionPlan, 'id'>) => {
  //   setData(prev => ({
  //     ...prev,
  //     subscriptionPlans: prev.subscriptionPlans.map(plan =>
  //       plan.id === id ? { ...updatedPlan, id } : plan
  //     )
  //   }));
  // };

  // const handleDeletePlan = (id: string) => {
  //   setData(prev => ({
  //     ...prev,
  //     subscriptionPlans: prev.subscriptionPlans.filter(plan => plan.id !== id)
  //   }));
  // };

  if(isDataPending) {
    return <h1 className='text-3xl text-center my-8 font-bold text-gray-400'>Loading...</h1>
  }

  if (!isReady) {
    return null;
  }

  return (
    <TonConnectUIProvider manifestUrl="https://yaver-496.github.io/IA-Entertainment-Dapp/tonconnect-manifest.json">
      <BrowserRouter>
        {/* <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 dark:text-white"> */}
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
                {/* <MobileHeader title="Subscription Plans" username={null} />
                <PlansPage
                  data={data}
                  onAddPlan={handleAddPlan}
                  onUpdatePlan={handleUpdatePlan}
                  onDeletePlan={handleDeletePlan}
                /> */}
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
        {/* </div> */}
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}

export default App;