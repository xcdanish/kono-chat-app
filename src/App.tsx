import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import LogoutConfirmation from './components/LogoutConfirmation';
import SettingsPanel from './components/SettingsPanel';
import ProfilePanel from './components/ProfilePanel';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import VideoCall from './components/VideoCall';
import UserProfile from './components/UserProfile';
import SplashScreen from './components/SplashScreen';
import FriendSearch from './components/FriendSearch';
import NotificationPanel from './components/NotificationPanel';
import CallHistory from './components/CallHistory';
import GroupCreation from './components/GroupCreation';
import { User, Chat, Message, CallState, AuthState, AppSettings, FriendRequest, Friend, Group, Notification, CallHistory as CallHistoryType, UploadProgress } from './types';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showFriendSearch, setShowFriendSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Default to dark mode
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    colorPalette: 'blue',
    fontSize: 'medium',
    fontStyle: 'inter'
  });
  
  const isDarkMode = settings.theme === 'dark';
  const [activeView, setActiveView] = useState('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isVideo: false,
    isMuted: false,
    isVideoOff: false,
    duration: 0
  });

  // Mock current user
  const currentUser: User = {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'online',
    email: 'alex.johnson@company.com',
    phone: '+1 (555) 123-4567'
  };

  const [userStatus, setUserStatus] = useState<User['status']>('online');

  // Mock friends
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      user: {
        id: '2',
        name: 'Sarah Williams',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'online',
        email: 'sarah.williams@company.com',
        phone: '+1 (555) 234-5678'
      },
      addedAt: new Date().toISOString()
    },
    {
      id: '2',
      user: {
        id: '3',
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'away',
        email: 'mike.chen@company.com',
        lastSeen: 'Last seen 2 hours ago'
      },
      addedAt: new Date().toISOString()
    }
  ]);

  // Mock friend requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      senderId: '4',
      receiverId: '1',
      senderName: 'Emily Davis',
      senderAvatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ]);

  // Mock groups
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'group1',
      name: 'Project Team',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      description: 'Main project discussion',
      members: [
        {
          user: currentUser,
          role: 'admin',
          joinedAt: new Date().toISOString()
        },
        {
          user: {
            id: '2',
            name: 'Sarah Williams',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            status: 'online',
            email: 'sarah.williams@company.com'
          },
          role: 'member',
          joinedAt: new Date().toISOString()
        }
      ],
      createdBy: '1',
      createdAt: new Date().toISOString(),
      isGroup: true
    }
  ]);

  // Mock chats (including groups)
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        id: '2',
        name: 'Sarah Williams',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'online',
        email: 'sarah.williams@company.com',
        phone: '+1 (555) 234-5678'
      },
      lastMessage: 'Hey! How are you doing today?',
      timestamp: new Date().toISOString(),
      unreadCount: 2,
      isGroup: false
    },
    {
      id: 'group1',
      group: groups[0],
      lastMessage: 'Meeting at 3 PM today',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unreadCount: 1,
      isGroup: true
    },
    {
      id: '2',
      user: {
        id: '3',
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'away',
        email: 'mike.chen@company.com',
        lastSeen: 'Last seen 2 hours ago'
      },
      lastMessage: 'Thanks for the project update!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      isGroup: false
    }
  ]);

  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'Emily Davis sent you a friend request',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionData: { requestId: '1' }
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Williams: Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false
    }
  ]);

  // Mock call history
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
    },
    {
      id: '2',
      participants: [
        {
          id: '3',
          name: 'Mike Chen',
          avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          status: 'away'
        }
      ],
      type: 'voice',
      duration: 0,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'missed',
      isGroup: false
    }
  ]);

  // Mock messages
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({
    '1': [
      {
        id: '1',
        senderId: '2',
        content: 'Hey Alex! How are you doing today?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'seen'
      },
      {
        id: '2',
        senderId: '1',
        content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'seen'
      },
      {
        id: '3',
        senderId: '2',
        content: 'I\'m good too! Just finished the presentation for tomorrow.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        type: 'text',
        reactions: [{ emoji: '👍', users: ['1'] }],
        status: 'seen'
      },
      {
        id: '4',
        senderId: '1',
        content: 'That\'s awesome! I\'m sure it will go well.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'delivered'
      }
    ],
    'group1': [
      {
        id: 'g1',
        senderId: '2',
        content: 'Meeting at 3 PM today',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'seen'
      },
      {
        id: 'g2',
        senderId: '1',
        content: 'Sounds good! I\'ll be there.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'delivered'
      }
    ]
  });

  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, authState.isAuthenticated ? 2500 : 0);

    return () => clearTimeout(timer);
  }, [authState.isAuthenticated]);

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

  const handleLogin = (email: string, password: string) => {
    setAuthState({
      isAuthenticated: true,
      user: { ...currentUser, email }
    });
    setShowSplash(true);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    setAuthState({
      isAuthenticated: true,
      user: { ...currentUser, name, email }
    });
    setShowSplash(true);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
    setShowLogoutConfirmation(false);
    setSelectedChatId(null);
    setShowUserProfile(false);
    setShowSettings(false);
    setShowProfilePanel(false);
  };

  const selectedChat = selectedChatId 
    ? chats.find(chat => chat.id === selectedChatId)
    : null;

  const selectedUser = selectedChat?.user;
  const selectedGroup = selectedChat?.group;

  const handleSendMessage = (content: string, replyTo?: string) => {
    if (!selectedChatId) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending',
      replyTo
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChatId]: prev[selectedChatId]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ) || []
      }));
    }, 1000);
  };

  const handleStartCall = (isVideo: boolean) => {
    if (selectedGroup) {
      // Check if user is admin for group calls
      const userMember = selectedGroup.members.find(m => m.user.id === currentUser.id);
      if (userMember?.role !== 'admin') {
        // Show error or notification
        return;
      }
    }

    setCallState({
      isActive: true,
      user: selectedUser,
      group: selectedGroup,
      isVideo,
      isMuted: false,
      isVideoOff: false,
      duration: 0,
      participants: selectedGroup ? selectedGroup.members.map(m => m.user) : [selectedUser!]
    });
  };

  const handleEndCall = () => {
    // Add to call history
    if (selectedUser || selectedGroup) {
      const newCall: CallHistoryType = {
        id: Date.now().toString(),
        participants: selectedGroup ? selectedGroup.members.map(m => m.user) : [selectedUser!],
        type: callState.isVideo ? 'video' : 'voice',
        duration: callState.duration,
        timestamp: new Date().toISOString(),
        status: 'completed',
        isGroup: !!selectedGroup,
        groupName: selectedGroup?.name
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
  };

  const handleToggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleToggleVideo = () => {
    setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      const newFriend: Friend = {
        id: Date.now().toString(),
        user: {
          id: request.senderId,
          name: request.senderName,
          avatar: request.senderAvatar,
          status: 'online'
        },
        addedAt: new Date().toISOString()
      };
      setFriends(prev => [...prev, newFriend]);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      
      // Remove notification
      setNotifications(prev => prev.filter(n => n.actionData?.requestId !== requestId));
    }
  };

  const handleRejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    setNotifications(prev => prev.filter(n => n.actionData?.requestId !== requestId));
  };

  const handleCreateGroup = (name: string, description: string, memberIds: string[]) => {
    const newGroup: Group = {
      id: `group${Date.now()}`,
      name,
      description,
      members: [
        {
          user: currentUser,
          role: 'admin',
          joinedAt: new Date().toISOString()
        },
        ...memberIds.map(id => {
          const friend = friends.find(f => f.user.id === id);
          return {
            user: friend!.user,
            role: 'member' as const,
            joinedAt: new Date().toISOString()
          };
        })
      ],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      isGroup: true
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Add to chats
    const newChat: Chat = {
      id: newGroup.id,
      group: newGroup,
      lastMessage: 'Group created',
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      isGroup: true
    };
    setChats(prev => [newChat, ...prev]);
    setShowGroupCreation(false);
  };

  const handleAddGroupMember = (groupId: string, memberId: string) => {
    const friend = friends.find(f => f.user.id === memberId);
    if (!friend) return;

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: [...group.members, {
            user: friend.user,
            role: 'member',
            joinedAt: new Date().toISOString()
          }]
        };
      }
      return group;
    }));

    // Update chats
    setChats(prev => prev.map(chat => {
      if (chat.id === groupId && chat.group) {
        const updatedGroup = groups.find(g => g.id === groupId);
        return { ...chat, group: updatedGroup };
      }
      return chat;
    }));
  };

  const handleRemoveGroupMember = (groupId: string, memberId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.user.id !== memberId)
        };
      }
      return group;
    }));

    // Update chats
    setChats(prev => prev.map(chat => {
      if (chat.id === groupId && chat.group) {
        const updatedGroup = groups.find(g => g.id === groupId);
        return { ...chat, group: updatedGroup };
      }
      return chat;
    }));
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const currentUserWithStatus = { ...currentUser, status: userStatus };
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  // Show authentication screens if not authenticated
  if (!authState.isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView('signup')}
          isDarkMode={isDarkMode}
        />
      );
    } else {
      return (
        <SignupScreen
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView('login')}
          isDarkMode={isDarkMode}
        />
      );
    }
  }

  return (
    <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
      <SplashScreen isVisible={showSplash} />
      
      {!showSplash && (
        <>
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <Sidebar
            currentUser={currentUserWithStatus}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
            onToggleDarkMode={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
            onStatusChange={setUserStatus}
            onShowSettings={() => setShowSettings(true)}
            onLogout={() => setShowLogoutConfirmation(true)}
            activeView={activeView}
            onViewChange={setActiveView}
            unreadNotificationCount={unreadNotificationCount}
            onShowNotifications={() => setShowNotifications(true)}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          
          {activeView === 'chats' && (
            <>
              {!showProfilePanel ? (
                <div className="flex flex-1 min-w-0">
                  <ChatList
                    chats={chats}
                    selectedChatId={selectedChatId}
                    onChatSelect={setSelectedChatId}
                    isDarkMode={isDarkMode}
                    colorPalette={settings.colorPalette}
                    onShowFriendSearch={() => setShowFriendSearch(true)}
                    onShowGroupCreation={() => setShowGroupCreation(true)}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                  />
                  
                  <ChatWindow
                    selectedUser={selectedUser}
                    selectedGroup={selectedGroup}
                    messages={selectedChatId ? messages[selectedChatId] || [] : []}
                    currentUserId={currentUser.id}
                    onSendMessage={handleSendMessage}
                    onStartCall={handleStartCall}
                    onShowUserProfile={() => setShowProfilePanel(true)}
                    isDarkMode={isDarkMode}
                    colorPalette={settings.colorPalette}
                    uploadProgress={uploadProgress}
                    setUploadProgress={setUploadProgress}
                    onShowGroupManagement={() => setShowGroupManagement(true)}
                  />
                </div>
              ) : (
                (selectedUser || selectedGroup) && (
                  <ProfilePanel
                    user={selectedUser}
                    group={selectedGroup}
                    currentUser={currentUser}
                    onBack={() => setShowProfilePanel(false)}
                    onStartCall={handleStartCall}
                    isDarkMode={isDarkMode}
                    colorPalette={settings.colorPalette}
                    onShowGroupManagement={() => setShowGroupManagement(true)}
                  />
                )
              )}
            </>
          )}
          
          {activeView === 'calls' && (
            <CallHistory
              callHistory={callHistory}
              isDarkMode={isDarkMode}
              colorPalette={settings.colorPalette}
            />
          )}
          
          {activeView !== 'chats' && activeView !== 'calls' && (
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
              <div className="text-center">
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This feature is coming soon
                </p>
              </div>
            </div>
          )}
          
          <VideoCall
            callState={callState}
            onEndCall={handleEndCall}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            isDarkMode={isDarkMode}
          />
          
          <LogoutConfirmation
            isVisible={showLogoutConfirmation}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirmation(false)}
            isDarkMode={isDarkMode}
          />
          
          <SettingsPanel
            isVisible={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSettingsChange={setSettings}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
            onToggleDarkMode={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
          />
          
          <FriendSearch
            isVisible={showFriendSearch}
            onClose={() => setShowFriendSearch(false)}
            friends={friends}
            friendRequests={friendRequests}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onRejectFriendRequest={handleRejectFriendRequest}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
          />
          
          <NotificationPanel
            isVisible={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onRejectFriendRequest={handleRejectFriendRequest}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
          />
          
          <GroupCreation
            isVisible={showGroupCreation}
            onClose={() => setShowGroupCreation(false)}
            friends={friends}
            onCreateGroup={handleCreateGroup}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
          />
          
          <GroupManagement
            isVisible={showGroupManagement}
            onClose={() => setShowGroupManagement(false)}
            group={selectedGroup}
            friends={friends}
            currentUser={currentUser}
            onAddMember={handleAddGroupMember}
            onRemoveMember={handleRemoveGroupMember}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
          />
          
          {(selectedUser || selectedGroup) && (
            <UserProfile
              user={selectedUser}
              group={selectedGroup}
              isVisible={showUserProfile}
              onClose={() => setShowUserProfile(false)}
              isDarkMode={isDarkMode}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;