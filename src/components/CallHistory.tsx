import React from 'react';
import { Phone, Video, PhoneIncoming, PhoneMissed, Clock, Users } from 'lucide-react';
import { CallHistory as CallHistoryType } from '../types';

interface CallHistoryProps {
  callHistory: CallHistoryType[];
  isDarkMode: boolean;
  colorPalette: string;
}

export default function CallHistory({ callHistory, isDarkMode, colorPalette }: CallHistoryProps) {
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

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'No answer';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCallIcon = (call: CallHistoryType) => {
    if (call.status === 'missed') {
      return PhoneMissed;
    } else if (call.type === 'video') {
      return Video;
    } else {
      return Phone;
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'missed':
        return 'text-red-500';
      case 'declined':
        return 'text-yellow-500';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Call History</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Recent calls and missed calls
        </p>
      </div>

      {/* Call History List */}
      <div className="flex-1 overflow-y-auto">
        {callHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <Phone className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No call history yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {callHistory.map((call) => {
              const CallIcon = getCallIcon(call);
              const participant = call.participants[0];
              
              return (
                <div
                  key={call.id}
                  className={`p-4 border-b ${isDarkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'} transition-colors cursor-pointer`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <CallIcon className={`w-5 h-5 ${getCallStatusColor(call.status)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {call.isGroup ? call.groupName : participant.name}
                        </h3>
                        {call.isGroup && (
                          <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {call.type === 'video' ? 'Video call' : 'Voice call'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTime(call.timestamp)}
                      </p>
                      <p className={`text-xs capitalize ${getCallStatusColor(call.status)}`}>
                        {call.status}
                      </p>
                    </div>
                    
                    <button
                      className={`p-2 rounded-lg transition-colors text-white`}
                      style={{ backgroundColor: colors.primary }}
                    >
                      {call.type === 'video' ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}