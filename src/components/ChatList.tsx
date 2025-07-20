import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function ChatList({ chats, selectedChatId, onChatSelect, isDarkMode, colorPalette }: ChatListProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const getColorPalette = () => {
    const palettes = {
      blue: { primary: '#3B82F6', secondary: '#DBEAFE' },
      green: { primary: '#10B981', secondary: '#D1FAE5' },
      purple: { primary: '#8B5CF6', secondary: '#EDE9FE' },
      orange: { primary: '#F59E0B', secondary: '#FEF3C7' },
    };
    return palettes[colorPalette as keyof typeof palettes] || palettes.blue;
  };

  const colors = getColorPalette();

  return (
    <div className={`w-80 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chats</h2>
          <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
            <Plus className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search conversations..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} cursor-pointer transition-all duration-200 ${
              selectedChatId === chat.id
                ? 'border-l-4'
                : isDarkMode
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-50'
            }`}
            style={selectedChatId === chat.id ? {
              backgroundColor: colors.secondary,
              borderLeftColor: colors.primary
            } : {}}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[chat.user.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {chat.user.name}
                  </h3>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${chat.isTyping ? 'italic text-blue-500' : ''}`}>
                    {chat.isTyping ? 'Typing...' : chat.lastMessage}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}