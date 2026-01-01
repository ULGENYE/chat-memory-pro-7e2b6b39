import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';

const STORAGE_KEY = 'ai-chat-conversations';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse conversations:', e);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      
      const updatedMessages = [...conv.messages, newMessage];
      const title = conv.messages.length === 0 && message.role === 'user' 
        ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
        : conv.title;

      return {
        ...conv,
        messages: updatedMessages,
        title,
        updatedAt: Date.now(),
      };
    }));

    return newMessage;
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(conversations.find(c => c.id !== conversationId)?.id || null);
    }
  }, [activeConversationId, conversations]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    addMessage,
    deleteConversation,
  };
};
