import { useState, useCallback } from 'react';

declare global {
  const puter: {
    ai: {
      chat: (message: string, options?: { model?: string }) => Promise<string>;
    };
    print: (response: string) => void;
  };
}

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      if (typeof puter === 'undefined') {
        throw new Error('API henüz yüklenmedi. Lütfen sayfayı yenileyin.');
      }

      const response = await puter.ai.chat(message, { model: 'gpt-4o-mini' });
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
