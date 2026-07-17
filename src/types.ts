export interface User {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  balance: number;
  totalEarned: number;
  totalAdsWatched: number;
}

export interface Config {
  adsgramBlockId: string;
  supportTelegramLink: string;
  telegramChannelUsername: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
  taskType: string;
  chatId?: string;
  targetUrl?: string;
  isActive: boolean;
}

export interface Withdrawal {
  _id: string;
  paymentMethod: string;
  goldAmount: number;
  realAmount: number;
  currency: string;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Referral {
  inviteeId: number;
  username?: string;
  firstName?: string;
  status: 'pending' | 'active';
  adCount: number;
  createdAt: string;
}
