import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Referral, User } from '../types';
import { initTelegram } from '../lib/telegram';
import { t } from '../lib/i18n';

// Khai báo cấu trúc Props truyền vào từ App.tsx để sửa lỗi TypeScript
interface InviteTabProps {
  user: User;
}

export const InviteTab: React.FC<InviteTabProps> = ({ user }) => {
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const { haptic } = initTelegram() || {};

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [infoRes, listRes] = await Promise.all([
        apiClient.getReferralInfo(),
        apiClient.getReferrals(),
      ]);
      setReferralInfo(infoRes.data);
      setReferrals(listRes.data.referrals);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralInfo?.referralCode || '');
    haptic?.notification('success');
    alert('Referral code copied!');
  };

  const handleShareLink = () => {
    const link = `https://t.me/MiniApp_NgDanhThanhTrung_Bot?start=${referralInfo?.referralCode}`;
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink(link);
    } else {
      window.open(link, '_blank');
    }
    haptic?.impact('medium');
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="bg-charcoal-800 rounded-xl p-6 h-32"></div>
          <div className="bg-charcoal-800 rounded-xl p-4 h-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold text-white mb-4">{t('inviteFriends')}</h2>

      <div className="bg-charcoal-800 rounded-xl p-6 mb-4">
        <p className="text-gray-400 mb-4">{t('inviteDesc')}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-charcoal-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gold-400">
              {referralInfo?.referralCount || 0}
            </p>
            <p className="text-sm text-gray-400">Total Referrals</p>
          </div>
          <div className="bg-charcoal-900 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gold-400">
              {referralInfo?.totalReferralEarnings || 0}
            </p>
            <p className="text-sm text-gray-400">Earnings (Gold)</p>
          </div>
        </div>

        <div className="bg-charcoal-900 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">{t('referralCode')}</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralInfo?.referralCode || ''}
              readOnly
              className="flex-1 bg-charcoal-800 text-white px-3 py-2 rounded-lg"
            />
            <button
              onClick={handleCopyCode}
              className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg"
            >
              {t('copyCode')}
            </button>
          </div>
        </div>

        <button
          onClick={handleShareLink}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-6 rounded-xl"
        >
          {t('shareLink')}
        </button>
      </div>

      <div className="bg-charcoal-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Your Referrals</h3>
        {referrals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No referrals yet</p>
        ) : (
          <div className="space-y-2">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="bg-charcoal-900 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {referral.username || referral.firstName || 'User'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {referral.adCount} ads watched
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    referral.status === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {referral.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
