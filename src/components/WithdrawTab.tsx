import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Withdrawal, User } from '../types';
import { initTelegram } from '../lib/telegram';
import { t } from '../lib/i18n';

// Khai báo cấu trúc Props đồng bộ nhận vào object user từ App.tsx
interface WithdrawTabProps {
  user: User;
}

// Giữ cấu trúc Props nhưng không bóc tách biến 'user' để tránh lỗi TS6133 (unused variable)
export const WithdrawTab: React.FC<WithdrawTabProps> = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'USDT',
    goldAmount: '',
    realAmount: '',
    currency: 'USDT',
    walletAddress: '',
  });

  const { haptic } = initTelegram() || {};

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const response = await apiClient.getWithdrawals();
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const goldAmount = Number(formData.goldAmount);
    if (!goldAmount || goldAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.walletAddress) {
      alert('Please enter wallet address');
      return;
    }

    setSubmitting(true);
    haptic?.impact('medium');

    try {
      await apiClient.createWithdrawal({
        paymentMethod: formData.paymentMethod,
        goldAmount,
        realAmount: Number(formData.realAmount) || goldAmount,
        currency: formData.currency,
        walletAddress: formData.walletAddress,
      });
      haptic?.notification('success');
      alert(t('withdrawalRequested'));
      setFormData({
        paymentMethod: 'USDT',
        goldAmount: '',
        realAmount: '',
        currency: 'USDT',
        walletAddress: '',
      });
      loadWithdrawals();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      haptic?.notification('error');
      alert(error.response?.data?.error || t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="bg-charcoal-800 rounded-xl p-6 h-48"></div>
          <div className="bg-charcoal-800 rounded-xl p-4 h-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold text-white mb-4">{t('withdrawals')}</h2>

      <form onSubmit={handleSubmit} className="bg-charcoal-800 rounded-xl p-6 mb-4">
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            {t('paymentMethod')}
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full bg-charcoal-900 text-white px-4 py-3 rounded-lg"
          >
            <option value="USDT">USDT (TRC20)</option>
            <option value="PayPal">PayPal</option>
            <option value="Mobile">Mobile Top-up</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            {t('amount')} (Gold)
          </label>
          <input
            type="number"
            value={formData.goldAmount}
            onChange={(e) => setFormData({ ...formData, goldAmount: e.target.value })}
            placeholder="Enter amount"
            className="w-full bg-charcoal-900 text-white px-4 py-3 rounded-lg"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            Real Amount
          </label>
          <input
            type="number"
            value={formData.realAmount}
            onChange={(e) => setFormData({ ...formData, realAmount: e.target.value })}
            placeholder="Optional"
            className="w-full bg-charcoal-900 text-white px-4 py-3 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full bg-charcoal-900 text-white px-4 py-3 rounded-lg"
          >
            <option value="USDT">USDT</option>
            <option value="USD">USD</option>
            <option value="VND">VND</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            {t('walletAddress')}
          </label>
          <input
            type="text"
            value={formData.walletAddress}
            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
            placeholder="Enter wallet address"
            className="w-full bg-charcoal-900 text-white px-4 py-3 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl"
        >
          {submitting ? t('loading') : t('requestWithdrawal')}
        </button>
      </form>

      <div className="bg-charcoal-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">History</h3>
        {withdrawals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No withdrawals yet</p>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="bg-charcoal-900 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {withdrawal.goldAmount} Gold
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    withdrawal.status === 'approved'
                      ? 'bg-green-600 text-white'
                      : withdrawal.status === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {withdrawal.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
