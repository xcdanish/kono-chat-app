import React from 'react';
import { X, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function UserProfile({ user, isVisible, onClose, isDarkMode }: UserProfileProps) {
  if (!isVisible) return null;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto`}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${statusColors[user.status]} rounded-full border-3 border-white`}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-blue-100">{statusLabels[user.status]}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Contact Information
            </h3>
            
            <div className="space-y-3">
              {user.email && (
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                    <Mail className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                  </div>
                </div>
              )}
              
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                    <Phone className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Last Seen */}
          {user.lastSeen && user.status !== 'online' && (
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Activity
              </h3>
              
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                  <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last seen</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.lastSeen}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors">
              Send Message
            </button>
            <button className={`px-4 py-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl transition-colors`}>
              <Phone className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}