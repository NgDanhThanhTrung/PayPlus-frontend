export const initTelegram = () => {
  const tg = (window as any).Telegram?.WebApp;
  
  if (!tg) {
    console.warn('Telegram WebApp not found');
    return null;
  }

  // Initialize theme
  tg.ready();
  tg.expand();

  // Set theme colors
  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
  document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
  document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
  document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);

  // Enable haptic feedback
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

export const closeApp = () => {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    tg.close();
  }
};
