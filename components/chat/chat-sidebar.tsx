'use client';

import { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageSquare, Trash2, LogOut, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
  pdfId?: string;
  messageCount?: number;
}

interface ChatSidebarProps {
  user: any;
  chats: Chat[];
  activeChat: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
  onLogout: () => void;
}

export const ChatSidebar = memo(function ChatSidebar({
  user,
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onLogout
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const handleChatClick = useCallback((chat: Chat) => {
    onSelectChat(chat);
  }, [onSelectChat]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  }, [onDeleteChat]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-2 rounded-lg">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">QueryDocs AI</h2>
            <p className="text-sm text-muted-foreground">AI Document Chat</p>
          </div>
        </div>
        
        <Button onClick={onNewChat} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Chat history */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative rounded-lg p-3 cursor-pointer transition-colors",
                "hover:bg-accent/50",
                activeChat?.id === chat.id && "bg-accent"
              )}
              onClick={() => {
                // Always call onSelectChat to ensure proper state management
                handleChatClick(chat);
              }}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {chat.title}
                  </p>
                  {/* <p className="text-xs text-muted-foreground">
                    {chat.messageCount || 0} messages
                  </p> */}
                </div>
              </div>
              
              {hoveredChat === chat.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteClick(e, chat.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {chats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Start a new conversation</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* User profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
});