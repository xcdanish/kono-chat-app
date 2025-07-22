import React, { useState } from 'react';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';
import { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  isDarkMode: boolean;
  colorPalette: string;
  onShowFriendSearch: () => void;
  onShowGroupCreation: () => void;
  onCloseMobileMenu: () => void;
}

export default function ChatList({ 
  chats, 
  selectedChatId, 
  onChatSelect, 
  isDarkMode, 
  colorPalette,
  onShowFriendSearch,
  onShowGroupCreation,
  onCloseMobileMenu
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);

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
      blue: { primary: '#3B82F6', secondary: '#DBEAFE', light: '#EFF6FF' },
      green: { primary: '#10B981', secondary: '#D1FAE5', light: '#ECFDF5' },
      purple: { primary: '#8B5CF6', secondary: '#EDE9FE', light: '#F5F3FF' },
      orange: { primary: '#F59E0B', secondary: '#FEF3C7', light: '#FFFBEB' },
    };
    return palettes[colorPalette as keyof typeof palettes] || palettes.blue;
  };

  const colors = getColorPalette();

  const filteredChats = chats.filter(chat => {
    const name = chat.user?.name || chat.group?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Listen for mobile back navigation
  React.useEffect(() => {
    const handleClearSelectedChat = () => {
      onChatSelect('');
    };
    
    window.addEventListener('clearSelectedChat', handleClearSelectedChat);
    return () => window.removeEventListener('clearSelectedChat', handleClearSelectedChat);
  }, [onChatSelect]);

  return (
    <div className={`
      w-full lg:w-80 lg:min-w-80
      ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
      lg:border-r flex flex-col
      ${selectedChatId && selectedChatId !== '' ? 'hidden lg:flex' : 'flex'}
    `}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chats</h2>
          <div className="relative">
            <button 
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <Plus className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            
            {/* Create Menu Dropdown */}
            {showCreateMenu && (
              <div className={`absolute right-0 top-full mt-2 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-xl shadow-xl border py-2 min-w-48 z-50`}>
                <button
                  onClick={() => {
                    onShowFriendSearch();
                    setShowCreateMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">New Chat</span>
                </button>
                <button
                  onClick={() => {
                    onShowGroupCreation();
                    setShowCreateMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">New Group</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            style={{ focusRingColor: colors.primary }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              onChatSelect(chat.id);
              onCloseMobileMenu();
            }}
            className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} cursor-pointer transition-all duration-200 active:bg-opacity-50 ${
              selectedChatId === chat.id
                ? 'border-l-4'
                : isDarkMode
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-50'
            }`}
            style={selectedChatId === chat.id ? {
              backgroundColor: isDarkMode ? colors.primary + '20' : colors.light,
              borderLeftColor: colors.primary
            } : {}}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {chat.isGroup ? (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {chat.group?.avatar ? (
                      <img
                        src={chat.group.avatar}
                        alt={chat.group.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Users className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    )}
                  </div>
                ) : (
                  <>
                    <img
                      src={chat.user!.avatar}
                      alt={chat.user!.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColors[chat.user!.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold truncate text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {chat.user?.name || chat.group?.name}
                    </h3>
                    {chat.isGroup && (
                      <Users className={`w-3.5 h-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} whitespace-nowrap`}>
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${chat.isTyping ? 'italic' : ''}`}
                     style={chat.isTyping ? { color: colors.primary } : {}}>
                    {chat.isTyping ? 'Typing...' : chat.lastMessage}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <span 
                      className="text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center flex-shrink-0 ml-2"
                      style={{ backgroundColor: colors.primary }}
                    >
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