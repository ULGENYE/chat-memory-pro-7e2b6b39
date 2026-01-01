import { useEffect, useRef } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatAreaProps {
  conversation: Conversation | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatArea = ({ conversation, onSendMessage, isLoading }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center glow">
            <Bot className="w-10 h-10 text-primary" />
          </div>
          <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            InformationChatAI'ye Hoş Geldiniz
          </h2>
            <p className="text-muted-foreground">
              Yeni bir sohbet başlatmak için sol menüden "Yeni Sohbet" butonuna tıklayın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="p-4 border-b border-border glass">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-medium text-foreground truncate">{conversation.title}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.messages.length} mesaj
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 scrollbar-thin" ref={scrollRef}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Nasıl yardımcı olabilirim?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Herhangi bir konuda soru sorabilirsiniz.
                </p>
              </div>
            </div>
          ) : (
            conversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4 message-appear">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput 
        onSend={onSendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};
