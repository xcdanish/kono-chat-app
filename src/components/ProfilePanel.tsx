import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, MessageCircle, Video, Users, Crown, UserMinus, Settings } from 'lucide-react';
import { User, Group } from '../types';

interface ProfilePanelProps {
  user?: User;
  group?: Group;
  currentUser: User;
  onBack: () => void;
  onStartCall: (isVideo: boolean) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function ProfilePanel({ 
  user, 
  group, 
  currentUser, 
  onBack, 
  onStartCall, 
  isDarkMode, 
  colorPalette 
}: ProfilePanelProps) {
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

  const isGroup = !!group;
  const isAdmin = group?.members.find(m => m.user.id === currentUser.id)?.role === 'admin';

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col`}>
      {/* Header */}
      <div 
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}dd)` }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-white text-lg">
            {isGroup ? 'Group Info' : 'Profile'}
          </h3>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User/Group Info Section */}
        <div className="p-8 text-center">
          <div className="relative inline-block mb-6">
            {isGroup ? (
              group?.avatar ? (
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <Users className={`w-16 h-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
              )
            ) : (
              <>
                <img
                  src={user!.avatar}
                  alt={user!.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusColors[user!.status]} rounded-full border-4 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
              </>
            )}
          </div>
          
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {user?.name || group?.name}
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            {isGroup 
              ? `${group?.members.length} members` 
              : statusLabels[user!.status]
            }
          </p>

          {group?.description && (
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 max-w-md mx-auto`}>
              {group.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => onBack()}
              className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: colors.primary }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
            {!isGroup && (
              <>
                <button
                  onClick={() => onStartCall(false)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => onStartCall(true)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video</span>
                </button>
              </>
            )}
            {isGroup && isAdmin && (
              <>
                <button
                  onClick={() => onStartCall(false)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => onStartCall(true)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact Information or Group Members */}
        {user ? (
          <div className={`mx-8 mb-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Contact Information
            </h3>
            
            <div className="space-y-4">
              {user.email && (
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl`}>
                    <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Email</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                  </div>
                </div>
              )}
              
              {user.phone && (
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl`}>
                    <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Phone</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`mx-8 mb-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Members ({group?.members.length})
              </h3>
              {isAdmin && (
                <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {group?.members.map((member) => (
                <div key={member.user.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={member.user.avatar}
                      alt={member.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[member.user.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {member.user.name}
                      </h4>
                      {member.role === 'admin' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.role === 'admin' ? 'Admin' : 'Member'}
                    </p>
                  </div>
                  {isAdmin && member.user.id !== currentUser.id && (
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Information */}
        {user?.lastSeen && user.status !== 'online' && (
          <div className={`mx-8 mb-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Activity
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl`}>
                <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Last seen</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.lastSeen}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}