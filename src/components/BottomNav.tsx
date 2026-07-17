import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'ads', icon: '🎬', label: 'Ads' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'invite', icon: '👥', label: 'Invite' },
    { id: 'withdraw', icon: '💰', label: 'Withdraw' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-charcoal-900 border-t border-gray-800 p-2">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'text-gold-500 bg-charcoal-800'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
