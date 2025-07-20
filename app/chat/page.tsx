'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadStoredAuthThunk } from '@/lib/slices/authSlice';
import { setActiveChat, clearChat } from '@/lib/slices/chatSlice';
import { toggleSidebar, setSidebarOpen } from '@/lib/slices/uiSlice';
import { useGetChatsQuery, useDeleteChatMutation, Chat } from '@/lib/api/chatApi';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatArea } from '@/components/chat/chat-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { logout } from '@/lib/slices/authSlice';
import { toast } from 'sonner';
import { useCallback, useMemo } from 'react';

// Transform API chat to component chat format
const transformChat = (apiChat: any): Chat => ({
  id: apiChat._id,
  title: apiChat.name || `Chat ${apiChat._id.slice(-6)}`,
  messages: [],
  createdAt: apiChat.createdAt, // <-- keep as string
  updatedAt: apiChat.createdAt, // <-- keep as string
  pdfId: apiChat._id,
});

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { activeChat } = useAppSelector((state) => state.chat);
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  
  const { data: chatsData, refetch: refetchChats } = useGetChatsQuery();
  const [deleteChat] = useDeleteChatMutation();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Memoize expensive operations
  const transformedChats = useMemo(() => {
    if (!chatsData?.result?.chats) return [];
    return chatsData.result.chats.map(transformChat);
  }, [chatsData?.result?.chats]);
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(loadStoredAuthThunk());
      setHasCheckedAuth(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (hasCheckedAuth && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, hasCheckedAuth, router]);

  useEffect(() => {
    setChats(transformedChats);
  }, [transformedChats]);

  const handleLogout = useCallback(() => {
    toast.success('Logged out successfully!', {
      description: 'You have been signed out of your account.',
      duration: 3000,
    });
    dispatch(logout());
    dispatch(clearChat());
    router.push('/login');
  }, [dispatch, router]);

  const handleNewChat = useCallback(() => {
    dispatch(setActiveChat(null));
    dispatch(setSidebarOpen(false));
  }, [dispatch]);

  const handleSelectChat = useCallback((chat: Chat) => {
    // Always set the chat, even if it's the same one
    dispatch(setActiveChat(chat));
    dispatch(setSidebarOpen(false));
  }, [dispatch]);

  const handleUpdateChat = useCallback((updatedChat: Chat) => {
    dispatch(setActiveChat(updatedChat));
    refetchChats();
  }, [dispatch, refetchChats]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Deleting chat...', {
        description: 'Removing chat and all messages',
        duration: Infinity,
      });
      
      await deleteChat(chatId).unwrap();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success toast
      toast.success('Chat deleted successfully!', {
        description: 'The chat and all its messages have been removed.',
        duration: 3000,
      });
      
      // Update state
      refetchChats();
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
      
      if (activeChat?.id === chatId) {
        dispatch(setActiveChat(null));
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error('Failed to delete chat', {
        description: 'There was an error deleting the chat. Please try again.',
        duration: 4000,
      });
    }
  }, [deleteChat, refetchChats, chats, activeChat?.id, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ChatSidebar
          user={user}
          chats={chats}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => dispatch(setSidebarOpen(true))}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {activeChat?.title || 'QueryDocs AI'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="lg:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <ChatArea
            chat={activeChat}
            onUpdateChat={handleUpdateChat}
            onChatListUpdate={refetchChats}
          />
        </div>
      </div>
    </div>
  );
}