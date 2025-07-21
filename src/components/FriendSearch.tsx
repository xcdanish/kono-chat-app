import React, { useState } from 'react';
import { X, Search, UserPlus, Check, X as XIcon, Users } from 'lucide-react';
import { Friend, FriendRequest } from '../types';

interface FriendSearchProps {
  isVisible: boolean;
  onClose: () => void;
  friends: Friend[];
  friendRequests: FriendRequest[];
  onAcceptFriendRequest: (requestId: string) => void;
  onRejectFriendRequest: (requestId: string) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function FriendSearch({
  isVisible,
  onClose,
  friends,
  friendRequests,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  isDarkMode,
  colorPalette
}: FriendSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  if (!isVisible) return null;

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

  const filteredFriends = friends.filter(friend =>
    friend.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = friendRequests.filter(req => req.status === 'pending');

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl h-full max-h-[600px] flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Users className={`w-6 h-6`} style={{ color: colors.primary }} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Friends & Requests
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-white border-b-2'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'friends' ? {
              backgroundColor: colors.primary + '20',
              borderBottomColor: colors.primary,
              color: colors.primary
            } : {}}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'text-white border-b-2'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'requests' ? {
              backgroundColor: colors.primary + '20',
              borderBottomColor: colors.primary,
              color: colors.primary
            } : {}}
          >
            Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
                style={{ backgroundColor: colors.primary }}
              >
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        {activeTab === 'friends' && (
          <div className="p-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search friends..."
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
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'friends' ? (
            <div className="space-y-3">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No friends found' : 'No friends yet'}
                  </p>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="relative">
                      <img
                        src={friend.user.avatar}
                        alt={friend.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[friend.user.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {friend.user.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {friend.user.status === 'online' ? 'Online' : friend.user.lastSeen || 'Offline'}
                      </p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white`}
                      style={{ backgroundColor: colors.primary }}
                    >
                      Message
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No pending friend requests
                  </p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <img
                      src={request.senderAvatar}
                      alt={request.senderName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.senderName}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Wants to be your friend
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onAcceptFriendRequest(request.id)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRejectFriendRequest(request.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}