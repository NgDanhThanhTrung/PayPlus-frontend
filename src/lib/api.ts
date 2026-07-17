import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add initData to all protected requests
api.interceptors.request.use((config) => {
  const initData = (window as any).Telegram?.WebApp?.initData;
  if (initData && !config.url?.includes('/config')) {
    config.headers['x-telegram-init-data'] = initData;
  }
  return config;
});

export const apiClient = {
  // Config
  getConfig: () => api.get<Config>('/config'),

  // Auth
  authenticate: () => api.post<{ success: boolean; user: User }>('/auth'),
  processReferral: (inviterId: number) =>
    api.post('/auth/referral', { inviterId }),

  // Ads
  watchAd: () => api.post('/ads/watch'),
  getAdStatus: () => api.get('/ads/status'),

  // Tasks
  getTasks: () => api.get<{ success: boolean; tasks: Task[] }>('/tasks'),
  checkTask: (taskId: string) => api.post('/tasks/check', { taskId }),
  getCompletedTasks: () => api.get('/tasks/completed'),

  // Withdraw
  createWithdrawal: (data: {
    paymentMethod: string;
    goldAmount: number;
    realAmount: number;
    currency: string;
    walletAddress: string;
  }) => api.post('/withdraw', data),
  getWithdrawals: () => api.get('/withdraw'),

  // Invite
  getReferralInfo: () => api.get('/invite/info'),
  getReferrals: () => api.get('/invite/list'),
};

export default api;
