import React from 'react';
import { X, Bell, Check, XIcon, MessageCircle, Phone, Users, Settings } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onAcceptFriendRequest: (requestId: string) => void;
  onRejectFriendRequest: (requestId: string) => void;
  isDarkMode: boolean;
  colorPalette: string;
}

export default function NotificationPanel({
  isVisible,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  isDarkMode,
  colorPalette
}: NotificationPanelProps) {
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return Users;
      case 'message':
        return MessageCircle;
      case 'call':
        return Phone;
      case 'system':
        return Settings;
      default:
        return Bell;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md h-full max-h-[600px] flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <Bell className={`w-6 h-6`} style={{ color: colors.primary }} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span 
                className="text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                style={{ backgroundColor: colors.primary }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="p-4">
            <button
              onClick={onMarkAllAsRead}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white`}
              style={{ backgroundColor: colors.primary }}
            >
              Mark All as Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Bell className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} ${
                      !notification.isRead 
                        ? isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                        : ''
                    } transition-colors`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-4 h-4`} style={{ color: colors.primary }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {notification.message}
                        </p>
                        
                        {/* Action Buttons for Friend Requests */}
                        {notification.type === 'friend_request' && notification.actionData && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                onAcceptFriendRequest(notification.actionData.requestId);
                                onMarkAsRead(notification.id);
                              }}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => {
                                onRejectFriendRequest(notification.actionData.requestId);
                                onMarkAsRead(notification.id);
                              }}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
                            >
                              <XIcon className="w-3 h-3" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Mark as Read Button */}
                        {!notification.isRead && notification.type !== 'friend_request' && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className={`text-xs transition-colors`}
                            style={{ color: colors.primary }}
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                      
                      {!notification.isRead && (
                        <div 
                          className="w-2 h-2 rounded-full mt-2"
                          style={{ backgroundColor: colors.primary }}
                        ></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}