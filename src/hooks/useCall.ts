import { useState, useEffect, useCallback } from 'react';
import { CallState, User, Group, CallHistory as CallHistoryType } from '../types';

export const useCall = () => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isVideo: false,
    isMuted: false,
    isVideoOff: false,
    duration: 0
  });

  const [callHistory, setCallHistory] = useState<CallHistoryType[]>([
    {
      id: '1',
      participants: [
        {
          id: '2',
          name: 'Sarah Williams',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          status: 'online'
        }
      ],
      type: 'video',
      duration: 1245,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      isGroup: false
    }
  ]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callState.isActive) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isActive]);

  const startCall = useCallback((user?: User, group?: Group, isVideo: boolean = false) => {
    setCallState({
      isActive: true,
      user,
      group,
      isVideo,
      isMuted: false,
      isVideoOff: false,
      duration: 0,
      participants: group ? group.members.map(m => m.user) : [user!]
    });
  }, []);

  const endCall = useCallback(() => {
    if (callState.user || callState.group) {
      const newCall: CallHistoryType = {
        id: Date.now().toString(),
        participants: callState.group ? callState.group.members.map(m => m.user) : [callState.user!],
        type: callState.isVideo ? 'video' : 'voice',
        duration: callState.duration,
        timestamp: new Date().toISOString(),
        status: 'completed',
        isGroup: !!callState.group,
        groupName: callState.group?.name
      };
      setCallHistory(prev => [newCall, ...prev]);
    }

    setCallState({
      isActive: false,
      isVideo: false,
      isMuted: false,
      isVideoOff: false,
      duration: 0
    });
  }, [callState]);

  const toggleMute = useCallback(() => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleVideo = useCallback(() => {
    setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  }, []);

  return {
    callState,
    callHistory,
    startCall,
    endCall,
    toggleMute,
    toggleVideo
  };
};