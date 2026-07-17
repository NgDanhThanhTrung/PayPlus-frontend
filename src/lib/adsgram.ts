declare global {
  interface Window {
    Adsgram?: {
      // Cấu hình chuẩn của Adsgram nhận vào một Object chứa blockId và các tham số như userId
      init: (config: { blockId: string; userId?: string }) => {
        onReward: (callback: () => void) => void;
        onError: (callback: (error: any) => void) => void;
        start: () => void;
      };
    };
  }
}

// Thay đổi: Nhận thêm telegramId để định danh tài khoản khi gửi lên hệ thống Adsgram
export const initAdsgram = (blockId: string, telegramId: number) => {
  if (!window.Adsgram) {
    console.error('Adsgram not loaded');
    return null;
  }

  // Khởi tạo Adsgram và đính kèm userId để nó map vào tham số [userId] trên Webhook Backend
  const ad = window.Adsgram.init({
    blockId: blockId,
    userId: telegramId.toString()
  });

  return {
    showAd: (): Promise<boolean> => {
      return new Promise((resolve) => {
        // Khi xem hết quảng cáo thành công
        ad.onReward(() => {
          resolve(true);
        });
        
        // Khi gặp lỗi hoặc người dùng tắt quảng cáo giữa chừng
        ad.onError((error) => {
          console.error('Adsgram error or skipped:', error);
          resolve(false);
        });
        
        // Bắt đầu chạy quảng cáo
        ad.start();
      });
    },
  };
};
