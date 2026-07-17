export const translations = {
  en: {
    appTitle: 'PayPlus',
    balance: 'Balance',
    gold: 'Gold',
    earn: 'Earn',
    withdraw: 'Withdraw',
    invite: 'Invite',
    watchAd: 'Watch Ad',
    watchAdDesc: 'Watch an ad to earn Gold',
    remainingAds: 'Remaining ads today',
    tasks: 'Tasks',
    completeTasks: 'Complete tasks to earn Gold',
    inviteFriends: 'Invite Friends',
    inviteDesc: 'Invite friends and earn bonuses',
    referralCode: 'Your referral code',
    copyCode: 'Copy Code',
    shareLink: 'Share Link',
    withdrawals: 'Withdrawals',
    requestWithdrawal: 'Request Withdrawal',
    paymentMethod: 'Payment Method',
    amount: 'Amount',
    walletAddress: 'Wallet Address',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    dailyLimit: 'Daily limit reached',
    taskCompleted: 'Task completed',
    insufficientBalance: 'Insufficient balance',
    withdrawalRequested: 'Withdrawal requested',
  },
  vi: {
    appTitle: 'PayPlus',
    balance: 'Số dư',
    gold: 'Vàng',
    earn: 'Kiếm tiền',
    withdraw: 'Rút tiền',
    invite: 'Mời',
    watchAd: 'Xem quảng cáo',
    watchAdDesc: 'Xem quảng cáo để kiếm Vàng',
    remainingAds: 'Quảng cáo còn lại hôm nay',
    tasks: 'Nhiệm vụ',
    completeTasks: 'Hoàn thành nhiệm vụ để kiếm Vàng',
    inviteFriends: 'Mời bạn bè',
    inviteDesc: 'Mời bạn bè để nhận thưởng',
    referralCode: 'Mã giới thiệu của bạn',
    copyCode: 'Sao chép mã',
    shareLink: 'Chia sẻ liên kết',
    withdrawals: 'Rút tiền',
    requestWithdrawal: 'Yêu cầu rút tiền',
    paymentMethod: 'Phương thức thanh toán',
    amount: 'Số lượng',
    walletAddress: 'Địa chỉ ví',
    submit: 'Gửi',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    dailyLimit: 'Đạt giới hạn ngày',
    taskCompleted: 'Đã hoàn thành nhiệm vụ',
    insufficientBalance: 'Số dư không đủ',
    withdrawalRequested: 'Đã yêu cầu rút tiền',
  },
};

export const getLanguage = (): 'en' | 'vi' => {
  const tg = (window as any).Telegram?.WebApp;
  const lang = tg?.initDataUnsafe?.user?.language_code || 'en';
  return lang.startsWith('vi') ? 'vi' : 'en';
};

export const t = (key: string): string => {
  const lang = getLanguage();
  return translations[lang][key as keyof typeof translations['en']] || key;
};
