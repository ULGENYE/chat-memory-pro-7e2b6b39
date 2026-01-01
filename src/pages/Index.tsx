import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatArea } from '@/components/ChatArea';
import { useConversations } from '@/hooks/useConversations';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiLoaded, setApiLoaded] = useState(false);
  const { toast } = useToast();
  
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    addMessage,
    deleteConversation,
  } = useConversations();

  const { sendMessage, isLoading } = useChat();

  // Load the API script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apifreellm.com/apifree.min.js';
    script.async = true;
    script.onload = () => {
      setApiLoaded(true);
      toast({
        title: 'API Yüklendi',
        description: 'AI asistanı kullanıma hazır.',
      });
    };
    script.onerror = () => {
      toast({
        title: 'API Yüklenemedi',
        description: 'Lütfen sayfayı yenileyin.',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const handleSendMessage = async (content: string) => {
    let conversationId = activeConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = createConversation();
    }

    // Add user message
    addMessage(conversationId, { role: 'user', content });

    try {
      // Get AI response
      const response = await sendMessage(content);
      addMessage(conversationId, { role: 'assistant', content: response });
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleNewConversation = () => {
    createConversation();
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setSidebarOpen(false);
          }}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteConversation}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <ChatArea
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>

      {/* API Loading Indicator */}
      {!apiLoaded && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-card border border-border px-4 py-2 rounded-full text-sm text-muted-foreground animate-pulse">
          API yükleniyor...
        </div>
      )}
    </div>
  );
};

export default Index;
