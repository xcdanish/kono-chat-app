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
import GroupManagement from './components/GroupManagement';
import { MessageCircle, Phone, Users, Bell, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { User, Chat, Message, CallState, AuthState, AppSettings, FriendRequest, Friend, Group, Notification, CallHistory as CallHistoryType, UploadProgress } from './types';

// Color palette configuration
const colorPalettes = {
  blue: {
    primary: '#3B82F6',
    light: '#EFF6FF',
    dark: '#1E40AF'
  },
  green: {
    primary: '#10B981',
    light: '#ECFDF5',
    dark: '#047857'
  },
  purple: {
    primary: '#8B5CF6',
    light: '#F3E8FF',
    dark: '#5B21B6'
  },
  pink: {
    primary: '#EC4899',
    light: '#FDF2F8',
    dark: '#BE185D'
  }
};

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400'
};

const statusLabels = {
  online: 'Online',
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline'
};

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Default to dark mode
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    colorPalette: 'blue',
    fontSize: 'medium',
    fontStyle: 'inter'
  });
  
  const isDarkMode = settings.theme === 'dark';
  const colors = colorPalettes[settings.colorPalette];
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

  const selectedUser = selectedChat && !selectedChat.isGroup ? selectedChat.user : undefined;
  const selectedGroup = selectedChat && selectedChat.isGroup ? selectedChat.group : undefined;

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
    <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
      <SplashScreen isVisible={showSplash} />
      
      {!showSplash && (
        <>
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
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Main Content Area */}
          <div className="flex-1 flex min-w-0 relative">
          {activeView === 'chats' && (
            <>
              {!showProfilePanel ? (
                <>
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
                    currentUser={currentUserWithStatus}
                    onSendMessage={handleSendMessage}
                    onStartCall={handleStartCall}
                    onShowUserProfile={() => setShowProfilePanel(true)}
                    isDarkMode={isDarkMode}
                    colorPalette={settings.colorPalette}
                    uploadProgress={uploadProgress}
                    setUploadProgress={setUploadProgress}
                    onShowGroupManagement={() => setShowGroupCreation(true)}
                    selectedChatId={selectedChatId}
                    onClearSelection={() => setSelectedChatId(null)}
                  />
                </>
              ) : (
                <ProfilePanel
                  user={selectedUser}
                  group={selectedGroup}
                  currentUser={currentUser}
                  onBack={() => setShowProfilePanel(false)}
                  onStartCall={handleStartCall}
                  isDarkMode={isDarkMode}
                  colorPalette={settings.colorPalette}
                  onShowGroupManagement={() => setShowGroupCreation(true)}
                />
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
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center p-4`}>
              <div className="text-center">
                <h3 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This feature is coming soon
                </p>
              </div>
            </div>
          )}
          </div>
          
          {/* Mobile Bottom Navigation */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t safe-area-inset-bottom z-40`}>
            <div className="flex items-center justify-around py-2">
              {[
                { id: 'chats', icon: MessageCircle, label: 'Chats' },
                { id: 'calls', icon: Phone, label: 'Calls' },
                { id: 'contacts', icon: Users, label: 'Contacts' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'text-white'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={activeView === item.id ? { backgroundColor: colors.primary } : {}}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
              
              {/* Notifications */}
              <button
                onClick={() => {
                  setShowNotifications(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors relative ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="text-xs font-medium">Alerts</span>
                {unreadNotificationCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </span>
                )}
              </button>
              
              {/* Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isMobileMenuOpen
                    ? 'text-white'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={isMobileMenuOpen ? { backgroundColor: colors.primary } : {}}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Menu</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Panel */}
          <div className={`lg:hidden fixed bottom-16 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t transform transition-transform duration-300 z-30 ${
            isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="p-4 space-y-3">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? colors.primary + '20' : colors.light }}>
                <div className="relative">
                  <img
                    src={currentUserWithStatus.avatar}
                    alt={currentUserWithStatus.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[currentUserWithStatus.status]} rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}></div>
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUserWithStatus.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {statusLabels[currentUserWithStatus.status]}
                  </p>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowLogoutConfirmation(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
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
          
          {(selectedUser || selectedGroup) && (
            <UserProfile
              user={selectedUser}
              group={selectedGroup}
              isVisible={showUserProfile}
              onClose={() => setShowUserProfile(false)}
              isDarkMode={isDarkMode}
            />
          )}
          
          <GroupManagement
            isVisible={showGroupCreation}
            onClose={() => setShowGroupCreation(false)}
            group={selectedGroup}
            friends={friends}
            currentUser={currentUser}
            onAddMember={handleAddGroupMember}
            onRemoveMember={handleRemoveGroupMember}
            isDarkMode={isDarkMode}
            colorPalette={settings.colorPalette}
          />
        </>
      )}
    </div>
  );
}

export default App;