declare global {
  interface Window {
    Adsgram?: {
      init: (blockId: string) => {
        onReward: (callback: (reward: number) => void) => void;
        onError: (callback: (error: any) => void) => void;
        start: () => void;
      };
    };
  }
}

export const initAdsgram = (blockId: string) => {
  if (!window.Adsgram) {
    console.error('Adsgram not loaded');
    return null;
  }

  const ad = window.Adsgram.init(blockId);

  return {
    showAd: (): Promise<number> => {
      return new Promise((resolve, reject) => {
        ad.onReward((reward) => {
          resolve(reward);
        });
        ad.onError((error) => {
          reject(error);
        });
        ad.start();
      });
    },
  };
};
