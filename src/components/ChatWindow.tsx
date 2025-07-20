import React, { useState } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, X } from 'lucide-react';
import { User, Message } from '../types';

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onStartCall: (isVideo: boolean) => void;
  onShowUserProfile: () => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function ChatWindow({ 
  selectedUser, 
  messages, 
  currentUserId, 
  onSendMessage, 
  onStartCall,
  onShowUserProfile,
  isDarkMode,
  colorPalette
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emojis = ['😀', '😂', '😍', '👍', '❤️', '😢', '😮', '😡'];

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

  if (!selectedUser) {
    return (
      <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
            <Send className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome to KoNo
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const statusLabels = {
    online: 'Online',
    away: 'Away',
    dnd: 'Do not disturb',
    invisible: 'Offline'
  };

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col`}>
      {/* Chat Header */}
      <div 
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}dd)` }}
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
            onClick={onShowUserProfile}
          >
            <div className="relative">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[selectedUser.status]} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">{selectedUser.name}</h3>
              <p className="text-sm text-blue-100">{statusLabels[selectedUser.status]}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onStartCall(false)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onStartCall(true)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? 'text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
              style={isOwnMessage ? { backgroundColor: colors.primary } : {}}>
                {message.type === 'file' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">{message.fileName}</span>
                    <span className="text-xs opacity-70">{message.fileSize}</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white opacity-70' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
                
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex space-x-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <span key={index} className="text-xs bg-white/20 rounded-full px-2 py-1">
                        {reaction.emoji} {reaction.users.length}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="relative">
          <div className="flex items-end space-x-3">
            <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}>
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
              >
                <Smile className="w-5 h-5" />
              </button>
              
              {showEmojiPicker && (
                <div className={`absolute bottom-full right-0 mb-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-3 grid grid-cols-4 gap-2`}>
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setNewMessage(newMessage + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: !newMessage.trim() ? undefined : colors.primary,
                ':hover': { backgroundColor: colors.primary + 'dd' }
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}