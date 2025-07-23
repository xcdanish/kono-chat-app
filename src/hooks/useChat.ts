import { useState, useCallback, useMemo } from 'react';
import { Chat, Message, User, Group, Friend, UploadProgress } from '../types';

export const useChat = (currentUser: User) => {
  // Mock data - in real app this would come from API/state management
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        id: '2',
        name: 'Sarah Williams',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'online',
        email: 'sarah.williams@company.com',
        phone: '+1 (555) 234-5678'
      },
      lastMessage: 'Hey! How are you doing today?',
      timestamp: new Date().toISOString(),
      unreadCount: 2,
      isGroup: false
    }
  ]);

  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({
    '1': [
      {
        id: '1',
        senderId: '2',
        content: 'Hey Alex! How are you doing today?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'seen'
      },
      {
        id: '2',
        senderId: '1',
        content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'seen'
      }
    ]
  });

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const selectedChat = useMemo(() => 
    selectedChatId ? chats.find(chat => chat.id === selectedChatId) : null,
    [selectedChatId, chats]
  );

  const selectedUser = useMemo(() => 
    selectedChat && !selectedChat.isGroup ? selectedChat.user : undefined,
    [selectedChat]
  );

  const selectedGroup = useMemo(() => 
    selectedChat && selectedChat.isGroup ? selectedChat.group : undefined,
    [selectedChat]
  );

  const sendMessage = useCallback((content: string, replyTo?: string) => {
    if (!selectedChatId) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending',
      replyTo
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChatId]: prev[selectedChatId]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ) || []
      }));
    }, 1000);
  }, [selectedChatId, currentUser.id]);

  const createGroup = useCallback((name: string, description: string, memberIds: string[]) => {
    // Implementation for group creation
    console.log('Creating group:', { name, description, memberIds });
  }, []);

  return {
    chats,
    messages: selectedChatId ? messages[selectedChatId] || [] : [],
    selectedChatId,
    selectedChat,
    selectedUser,
    selectedGroup,
    uploadProgress,
    setSelectedChatId,
    setUploadProgress,
    sendMessage,
    createGroup
  };
};