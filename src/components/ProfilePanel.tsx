import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, MessageCircle, Video } from 'lucide-react';
import { User } from '../types';

interface ProfilePanelProps {
  user: User;
  onBack: () => void;
  onStartCall: (isVideo: boolean) => void;
  isDarkMode: boolean;
}

export default function ProfilePanel({ user, onBack, onStartCall, isDarkMode }: ProfilePanelProps) {
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
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-blue-500 to-blue-600`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-white text-lg">Profile</h3>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Info Section */}
        <div className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusColors[user.status]} rounded-full border-4 ${isDarkMode ? 'border-gray-900' : 'border-white'}`}></div>
          </div>
          
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {user.name}
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            {statusLabels[user.status]}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => onBack()}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
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
          </div>
        </div>

        {/* Contact Information */}
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

        {/* Activity Information */}
        {user.lastSeen && user.status !== 'online' && (
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