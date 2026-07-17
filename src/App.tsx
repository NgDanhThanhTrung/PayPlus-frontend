import { useState, useEffect } from 'react';
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
    // Khởi tạo giao diện, theme Telegram Mini App
    initTelegram();
    // Gọi API xác thực thông tin user dựa trên initData
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
    // Nếu vẫn đang loading lần đầu, chưa render nội dung tab để tránh crash giao diện do thiếu dữ liệu user
    if (loading || !user) return null;

    // Truyền user và loadUser xuống các tab con để đồng bộ trạng thái số dư Gold khi làm nhiệm vụ/xem ads
    switch (activeTab) {
      case 'ads':
        return <AdsTab user={user} onRefreshUser={loadUser} />;
      case 'tasks':
        return <TasksTab user={user} onRefreshUser={loadUser} />;
      case 'invite':
        return <InviteTab user={user} />;
      case 'withdraw':
        return <WithdrawTab user={user} onRefreshUser={loadUser} />;
      default:
        return <AdsTab user={user} onRefreshUser={loadUser} />;
    }
  };

  // Hiển thị màn hình Loading chào mừng sinh động khi mở Mini App lần đầu
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
        <h2 className="text-xl font-bold text-yellow-500 animate-pulse">PayPlus</h2>
        <p className="text-sm text-gray-400 mt-2">Connecting to Telegram secure server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-900 text-white flex flex-col justify-between pb-24">
      <div>
        <Header user={user} loading={loading} />
        <div className="pt-4 px-4">
          {renderTab()}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
