import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmationProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export default function LogoutConfirmation({ isVisible, onConfirm, onCancel, isDarkMode }: LogoutConfirmationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Confirm Logout
            </h3>
          </div>
          <button
            onClick={onCancel}
            className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Are you sure you want to logout? You'll need to sign in again to access your conversations.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-xl border ${
              isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}