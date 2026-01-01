import { useState, useCallback } from 'react';

declare global {
  interface Window {
    apifree: {
      chat: (message: string) => Promise<string>;
      print: (response: string) => void;
    };
  }
}

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Check if apifree is loaded
      if (!window.apifree) {
        throw new Error('API henüz yüklenmedi. Lütfen sayfayı yenileyin.');
      }

      const response = await window.apifree.chat(message);
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
  };
};
