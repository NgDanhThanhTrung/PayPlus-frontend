import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { initAdsgram } from '../lib/adsgram';
import { initTelegram } from '../lib/telegram';
import { t } from '../lib/i18n';

export const AdsTab: React.FC = () => {
  const [remainingAds, setRemainingAds] = useState(15);
  const [loading, setLoading] = useState(false);
  const [adsgramBlockId, setAdsgramBlockId] = useState('0');

  const { haptic } = initTelegram() || {};

  useEffect(() => {
    loadAdStatus();
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await apiClient.getConfig();
      setAdsgramBlockId(response.data.adsgramBlockId);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const loadAdStatus = async () => {
    try {
      const response = await apiClient.getAdStatus();
      setRemainingAds(response.data.remainingAds);
    } catch (error) {
      console.error('Failed to load ad status:', error);
    }
  };

  const handleWatchAd = async () => {
    if (remainingAds <= 0) {
      haptic?.notification('error');
      alert(t('dailyLimit'));
      return;
    }

    setLoading(true);
    haptic?.impact('medium');

    try {
      const ad = initAdsgram(adsgramBlockId);
      if (!ad) {
        throw new Error('Adsgram not initialized');
      }

      await ad.showAd();
      haptic?.notification('success');

      // Call backend to record ad view
      const response = await apiClient.watchAd();
      setRemainingAds(response.data.remainingAds);
    } catch (error) {
      console.error('Ad error:', error);
      haptic?.notification('error');
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="bg-charcoal-800 rounded-xl p-6 mb-4">
        <h2 className="text-xl font-bold text-white mb-2">{t('watchAd')}</h2>
        <p className="text-gray-400 mb-4">{t('watchAdDesc')}</p>
        
        <div className="bg-charcoal-900 rounded-lg p-4 mb-4">
          <p className="text-gold-400 text-lg font-semibold">
            {t('remainingAds')}: {remainingAds}
          </p>
        </div>

        <button
          onClick={handleWatchAd}
          disabled={loading || remainingAds <= 0}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-colors"
        >
          {loading ? t('loading') : t('watchAd')}
        </button>
      </div>

      <div className="bg-charcoal-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">💡 Tips</h3>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>• Watch up to 15 ads per day</li>
          <li>• Earn 100 Gold per ad</li>
          <li>• Get 50 Gold bonus with active referrals</li>
        </ul>
      </div>
    </div>
  );
};
