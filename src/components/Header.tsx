import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="bg-charcoal-900 text-white p-4">
        <div className="animate-pulse h-6 bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-900 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gold-400">PayPlus</h1>
          <p className="text-sm text-gray-400">
            {user?.firstName || user?.username || 'User'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Balance</p>
          <p className="text-2xl font-bold text-gold-500">
            {user?.balance || 0} <span className="text-sm">Gold</span>
          </p>
        </div>
      </div>
    </div>
  );
};
