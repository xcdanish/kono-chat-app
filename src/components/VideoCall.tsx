import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MoreVertical } from 'lucide-react';
import { CallState, User } from '../types';

interface VideoCallProps {
  callState: CallState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  isDarkMode: boolean;
}

export default function VideoCall({ 
  callState, 
  onEndCall, 
  onToggleMute, 
  onToggleVideo,
  isDarkMode 
}: VideoCallProps) {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!callState.isActive) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [callState.isActive, showControls]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callState.isActive) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Call Header */}
      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent z-10 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <img
              src={callState.user?.avatar}
              alt={callState.user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{callState.user?.name}</h3>
              <p className="text-sm text-gray-300">{formatDuration(callState.duration)}</p>
            </div>
          </div>
          
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          {callState.isVideo ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {callState.user?.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{callState.user?.name}</h3>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {callState.user?.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{callState.user?.name}</h3>
              <p className="text-gray-400">Voice call</p>
            </div>
          )}
        </div>

        {/* Picture-in-Picture (Local Video) */}
        {callState.isVideo && (
          <div className="absolute top-6 right-6 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
            {callState.isVideoOff ? (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">You</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={onToggleMute}
            className={`p-4 rounded-full transition-all ${
              callState.isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {callState.isVideo && (
            <button
              onClick={onToggleVideo}
              className={`p-4 rounded-full transition-all ${
                callState.isVideoOff
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              } text-white`}
            >
              {callState.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors">
            <Monitor className="w-6 h-6" />
          </button>

          <button
            onClick={onEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}