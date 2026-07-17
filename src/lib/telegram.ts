// Lấy trực tiếp thực thể WebApp từ window
export const tg = (window as any).Telegram?.WebApp;

export const initTelegram = () => {
  if (!tg) {
    console.warn('Telegram WebApp not found');
    return null;
  }

  // Initialize theme
  tg.ready();
  tg.expand();

  // Set theme colors
  if (tg.themeParams) {
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
  }

  // Enable haptic feedback[cite: 3]
  const haptic = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    },
    selection: () => {
      if (tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
      }
    },
  };

  return { tg, haptic };
};

// Hàm tiện ích lấy nhanh thông tin User (Bao gồm cả ID Telegram) từ Mini App
export const getTelegramUser = () => {
  if (!tg) return null;
  return tg.initDataUnsafe?.user || null;
};

// Hàm tiện ích lấy chuỗi initData thô phục vụ xác thực bảo mật ở Backend (nếu cần)
export const getTelegramInitData = () => {
  return tg?.initData || '';
};

export const closeApp = () => {
  if (tg) {
    tg.close();
  }
};
