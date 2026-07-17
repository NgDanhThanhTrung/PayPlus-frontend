import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AdsTab } from './components/AdsTab';
import { TasksTab } from './components/TasksTab';
import { InviteTab } from './components/InviteTab';
import { WithdrawTab } from './components/WithdrawTab';
import { apiClient } from './lib/api';
import { initTelegram } from './lib/telegram';
import { User } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('ads');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initTelegram();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.authenticate();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'ads':
        return <AdsTab />;
      case 'tasks':
        return <TasksTab />;
      case 'invite':
        return <InviteTab />;
      case 'withdraw':
        return <WithdrawTab />;
      default:
        return <AdsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 text-white">
      <Header user={user} loading={loading} />
      <div className="pt-4">
        {renderTab()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
