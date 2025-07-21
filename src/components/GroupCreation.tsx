import React, { useState } from 'react';
import { X, Users, Search, Check } from 'lucide-react';
import { Friend } from '../types';

interface GroupCreationProps {
  isVisible: boolean;
  onClose: () => void;
  friends: Friend[];
  onCreateGroup: (name: string, description: string, memberIds: string[]) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function GroupCreation({
  isVisible,
  onClose,
  friends,
  onCreateGroup,
  isDarkMode,
  colorPalette
}: GroupCreationProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName.trim(), groupDescription.trim(), selectedMembers);
      setGroupName('');
      setGroupDescription('');
      setSelectedMembers([]);
      setSearchQuery('');
    }
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl h-full max-h-[700px] flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Users className={`w-6 h-6`} style={{ color: colors.primary }} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Group
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
        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              style={{ focusRingColor: colors.primary }}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Description (Optional)
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
              rows={2}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
              style={{ focusRingColor: colors.primary }}
            />
          </div>
        </div>

        {/* Member Selection */}
        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-1 flex flex-col`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Members
              </h3>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedMembers.length} selected
              </span>
            </div>
            
            {/* Search */}
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

          {/* Friends List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'No friends found' : 'No friends available'}
                  </p>
                </div>
              ) : (
                filteredFriends.map((friend) => {
                  const isSelected = selectedMembers.includes(friend.user.id);
                  return (
                    <div
                      key={friend.id}
                      onClick={() => handleToggleMember(friend.user.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      }`}
                      style={isSelected ? { backgroundColor: colors.light } : {}}
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
                      {isSelected && (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex space-x-3`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: (!groupName.trim() || selectedMembers.length === 0) ? '#9CA3AF' : colors.primary 
            }}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}