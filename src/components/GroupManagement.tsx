import React, { useState } from 'react';
import { X, Users, Search, UserPlus, UserMinus, Crown, Check } from 'lucide-react';
import { Group, Friend, User } from '../types';

interface GroupManagementProps {
  isVisible: boolean;
  onClose: () => void;
  group?: Group;
  friends: Friend[];
  currentUser: User;
  onAddMember: (groupId: string, memberId: string) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function GroupManagement({
  isVisible,
  onClose,
  group,
  friends,
  currentUser,
  onAddMember,
  onRemoveMember,
  isDarkMode,
  colorPalette
}: GroupManagementProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'add'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  if (!isVisible || !group) return null;

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
  const isAdmin = group.members.find(m => m.user.id === currentUser.id)?.role === 'admin';

  // Get friends not in group
  const availableFriends = friends.filter(friend => 
    !group.members.some(member => member.user.id === friend.user.id) &&
    friend.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = group.members.filter(member =>
    member.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const handleRemoveMember = (memberId: string) => {
    onRemoveMember(group.id, memberId);
    setShowRemoveConfirm(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl h-full max-h-[600px] flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Users className={`w-6 h-6`} style={{ color: colors.primary }} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Manage Group
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Group Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                <Users className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            )}
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {group.name}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {group.members.length} members
              </p>
              {group.description && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                  {group.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-white border-b-2'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'members' ? {
              backgroundColor: colors.primary + '20',
              borderBottomColor: colors.primary,
              color: colors.primary
            } : {}}
          >
            Members ({group.members.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'add'
                  ? 'text-white border-b-2'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={activeTab === 'add' ? {
                backgroundColor: colors.primary + '20',
                borderBottomColor: colors.primary,
                color: colors.primary
              } : {}}
            >
              Add Members
            </button>
          )}
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder={activeTab === 'members' ? 'Search members...' : 'Search friends...'}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {activeTab === 'members' ? (
            <div className="space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No members found
                  </p>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member.user.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="relative">
                      <img
                        src={member.user.avatar}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[member.user.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.user.name}
                        </h3>
                        {member.role === 'admin' && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </p>
                    </div>
                    {isAdmin && member.user.id !== currentUser.id && (
                      <button
                        onClick={() => setShowRemoveConfirm(member.user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {availableFriends.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No friends found' : 'All friends are already in this group'}
                  </p>
                </div>
              ) : (
                availableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="relative">
                      <img
                        src={friend.user.avatar}
                        alt={friend.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[friend.user.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {friend.user.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {friend.user.status === 'online' ? 'Online' : friend.user.lastSeen || 'Offline'}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddMember(group.id, friend.user.id)}
                      className="p-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Remove Confirmation Modal */}
        {showRemoveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md p-6`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Remove Member
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to remove this member from the group? They will no longer have access to the group chat.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveMember(showRemoveConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}