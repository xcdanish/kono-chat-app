import React from 'react';
import { MessageCircle, Phone, Video, Settings, Users, Moon, Sun, LogOut, ChevronDown, Bell } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  isDarkMode: boolean;
  colorPalette: string;
  onToggleDarkMode: () => void;
  onStatusChange: (status: User['status']) => void;
  onShowSettings: () => void;
  onLogout: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  unreadNotificationCount: number;
  onShowNotifications: () => void;
}

export default function Sidebar({ 
  currentUser, 
  isDarkMode, 
  colorPalette,
  onToggleDarkMode, 
  onStatusChange,
  onShowSettings,
  onLogout,
  activeView,
  onViewChange,
  unreadNotificationCount,
  onShowNotifications
}: SidebarProps) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const statusLabels = {
    online: 'Online',
    away: 'Away',
    dnd: 'Do Not Disturb',
    invisible: 'Invisible'
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

  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
  ];

  return (
    <div className={`w-20 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col items-center py-6 space-y-6`}>
      {/* User Avatar with Status */}
      <div className="relative group cursor-pointer">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-12 h-12 rounded-xl object-cover ring-3 cursor-pointer transition-transform hover:scale-105"
          style={{ ringColor: colors.primary }}
        />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[currentUser.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} flex items-center justify-center`}>
          <ChevronDown className="w-2 h-2 text-white" />
        </div>
        
        {/* Status Dropdown */}
        <div className={`absolute left-full ml-2 top-0 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-xl shadow-xl border py-3 min-w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
          <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-2`}>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set your status</p>
          </div>
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              onClick={() => onStatusChange(status as User['status'])}
              className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                currentUser.status === status 
                  ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50')
                  : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
              }`}
            >
              <div className={`w-3 h-3 ${statusColors[status as User['status']]} rounded-full`}></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-3 rounded-xl transition-all duration-200 relative group ${
              activeView === item.id
                ? 'text-white shadow-lg'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            style={activeView === item.id ? { backgroundColor: colors.primary } : {}}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <div className={`absolute left-full ml-2 px-2 py-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50`}>
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      {/* Notifications Button */}
      <button
        onClick={onShowNotifications}
        className={`p-3 rounded-xl transition-all duration-200 relative ${
          isDarkMode
            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <Bell className="w-6 h-6" />
        {unreadNotificationCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
            style={{ backgroundColor: colors.primary }}
          >
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Settings Button */}
      <button
        onClick={onShowSettings}
        className={`p-3 rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={`p-3 rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        <LogOut className="w-6 h-6" />
      </button>
    </div>
  );
}