import React, { useState, useEffect, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { useChat } from './hooks/useChat';
import { useCall } from './hooks/useCall';
import { getColorPalette } from './utils/colorPalettes';
import { MessageCircle, Phone, Users, Bell, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { User, FriendRequest, Friend, Group, Notification } from './types';

// Lazy load components
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const SignupScreen = lazy(() => import('./components/SignupScreen'));
const ChatList = lazy(() => import('./components/ChatList'));
const ChatWindow = lazy(() => import('./components/ChatWindow'));
const VideoCall = lazy(() => import('./components/VideoCall'));
const CallHistory = lazy(() => import('./components/CallHistory'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const ProfilePanel = lazy(() => import('./components/ProfilePanel'));
const FriendSearch = lazy(() => import('./components/FriendSearch'));
const NotificationPanel = lazy(() => import('./components/NotificationPanel'));
const GroupCreation = lazy(() => import('./components/GroupCreation'));
const GroupManagement = lazy(() => import('./components/GroupManagement'));
const LogoutConfirmation = lazy(() => import('./components/LogoutConfirmation'));
const UserProfile = lazy(() => import('./components/UserProfile'));

// Loading component for Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showFriendSearch, setShowFriendSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('chats');
  const [userStatus, setUserStatus] = useState<User['status']>('online');

  // Custom hooks
  const { authState, login, signup, logout } = useAuth();
  const { settings, isDarkMode, updateSettings, toggleDarkMode } = useSettings();
  const colors = getColorPalette(settings.colorPalette);
  
  // Only initialize chat and call hooks if authenticated
  const currentUser = authState.user ? { ...authState.user, status: userStatus } : null;
  const chatHook = useChat(currentUser);
  const { callState, callHistory, startCall, endCall, toggleMute, toggleVideo } = useCall();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, authState.isAuthenticated ? 2500 : 0);

    return () => clearTimeout(timer);
  }, [authState.isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    login(email, password);
    setShowSplash(true);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    signup(name, email, password);
    setShowSplash(true);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirmation(false);
    setShowUserProfile(false);
    setShowSettings(false);
    setShowProfilePanel(false);
  };

  const handleStartCall = (isVideo: boolean) => {
    if (chatHook?.selectedGroup) {
      // Check if user is admin for group calls
      const userMember = chatHook.selectedGroup.members.find(m => m.user.id === currentUser!.id);
      if (userMember?.role !== 'admin') {
        // Show error or notification
        return;
      }
    }

    startCall(chatHook?.selectedUser, chatHook?.selectedGroup, isVideo);
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
    chatHook?.createGroup(name, description, memberIds);
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

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  // Show authentication screens if not authenticated
  if (!authState.isAuthenticated) {
    if (authView === 'login') {
      return (
        <ErrorBoundary>
          <Suspense fallback={<ComponentLoader />}>
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToSignup={() => setAuthView('signup')}
              isDarkMode={isDarkMode}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else {
      return (
        <ErrorBoundary>
          <Suspense fallback={<ComponentLoader />}>
            <SignupScreen
              onSignup={handleSignup}
              onSwitchToLogin={() => setAuthView('login')}
              isDarkMode={isDarkMode}
            />
          </Suspense>
        </ErrorBoundary>
      );
    }
  }

  // Don't render main app if user is not available
  if (!currentUser) {
    return <ComponentLoader />;
  }

  return (
    <ErrorBoundary>
      <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
        <SplashScreen isVisible={showSplash} />
        
        {!showSplash && (
          <>
            <Sidebar
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              colorPalette={settings.colorPalette}
              onToggleDarkMode={toggleDarkMode}
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
              <Suspense fallback={<ComponentLoader />}>
                {activeView === 'chats' && (
                  <>
                    {!showProfilePanel ? (
                      <>
                        <ChatList
                          chats={chatHook.chats}
                          selectedChatId={chatHook.selectedChatId}
                          onChatSelect={chatHook.setSelectedChatId}
                          isDarkMode={isDarkMode}
                          colorPalette={settings.colorPalette}
                          onShowFriendSearch={() => setShowFriendSearch(true)}
                          onShowGroupCreation={() => setShowGroupCreation(true)}
                          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                        />
                        
                        <ChatWindow
                          selectedUser={chatHook.selectedUser}
                          selectedGroup={chatHook.selectedGroup}
                          messages={chatHook.messages}
                          currentUserId={currentUser.id}
                          currentUser={currentUser}
                          onSendMessage={chatHook.sendMessage}
                          onStartCall={handleStartCall}
                          onShowUserProfile={() => setShowProfilePanel(true)}
                          isDarkMode={isDarkMode}
                          colorPalette={settings.colorPalette}
                          uploadProgress={chatHook.uploadProgress}
                          setUploadProgress={chatHook.setUploadProgress}
                          onShowGroupManagement={() => setShowGroupManagement(true)}
                          selectedChatId={chatHook.selectedChatId}
                          onClearSelection={() => chatHook.setSelectedChatId(null)}
                        />
                      </>
                    ) : (
                      <ProfilePanel
                        user={chatHook.selectedUser}
                        group={chatHook.selectedGroup}
                        currentUser={currentUser}
                        onBack={() => setShowProfilePanel(false)}
                        onStartCall={handleStartCall}
                        isDarkMode={isDarkMode}
                        colorPalette={settings.colorPalette}
                        onShowGroupManagement={() => setShowGroupManagement(true)}
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
              </Suspense>
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
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}></div>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentUser.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Online
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
                      toggleDarkMode();
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
            
            {/* Lazy loaded modals and overlays */}
            <Suspense fallback={null}>
              <VideoCall
                callState={callState}
                onEndCall={endCall}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
                isDarkMode={isDarkMode}
              />
              
              {showLogoutConfirmation && (
                <LogoutConfirmation
                  isVisible={showLogoutConfirmation}
                  onConfirm={handleLogout}
                  onCancel={() => setShowLogoutConfirmation(false)}
                  isDarkMode={isDarkMode}
                />
              )}
              
              {showSettings && (
                <SettingsPanel
                  isVisible={showSettings}
                  onClose={() => setShowSettings(false)}
                  settings={settings}
                  onSettingsChange={updateSettings}
                  isDarkMode={isDarkMode}
                  colorPalette={settings.colorPalette}
                  onToggleDarkMode={toggleDarkMode}
                />
              )}
              
              {showFriendSearch && (
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
              )}
              
              {showNotifications && (
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
              )}
              
              {showGroupCreation && (
                <GroupCreation
                  isVisible={showGroupCreation}
                  onClose={() => setShowGroupCreation(false)}
                  friends={friends}
                  onCreateGroup={handleCreateGroup}
                  isDarkMode={isDarkMode}
                  colorPalette={settings.colorPalette}
                />
              )}
              
              {showGroupManagement && (
                <GroupManagement
                  isVisible={showGroupManagement}
                  onClose={() => setShowGroupManagement(false)}
                  group={chatHook.selectedGroup}
                  friends={friends}
                  currentUser={currentUser}
                  onAddMember={handleAddGroupMember}
                  onRemoveMember={handleRemoveGroupMember}
                  isDarkMode={isDarkMode}
                  colorPalette={settings.colorPalette}
                />
              )}
              
              {showUserProfile && (chatHook.selectedUser || chatHook.selectedGroup) && (
                <UserProfile
                  user={chatHook.selectedUser}
                  group={chatHook.selectedGroup}
                  isVisible={showUserProfile}
                  onClose={() => setShowUserProfile(false)}
                  isDarkMode={isDarkMode}
                />
              )}
            </Suspense>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;