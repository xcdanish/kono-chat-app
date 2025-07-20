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
import { User, Chat, Message, CallState, AuthState, AppSettings } from './types';

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
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
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

  // Mock chats
  const [chats] = useState<Chat[]>([
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
      unreadCount: 2
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
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        id: '4',
        name: 'Emily Davis',
        avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'dnd',
        email: 'emily.davis@company.com'
      },
      lastMessage: 'Can we schedule a meeting tomorrow?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      unreadCount: 1,
      isTyping: false
    }
  ]);

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2',
      content: 'Hey Alex! How are you doing today?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'text'
    },
    {
      id: '2',
      senderId: '1',
      content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      type: 'text'
    },
    {
      id: '3',
      senderId: '2',
      content: 'I\'m good too! Just finished the presentation for tomorrow.',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      type: 'text',
      reactions: [{ emoji: '👍', users: ['1'] }]
    },
    {
      id: '4',
      senderId: '1',
      content: 'That\'s awesome! I\'m sure it will go well.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'text'
    }
  ]);

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
    // Simulate authentication
    setAuthState({
      isAuthenticated: true,
      user: { ...currentUser, email }
    });
    setShowSplash(true);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // Simulate registration
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

  const selectedUser = selectedChatId 
    ? chats.find(chat => chat.id === selectedChatId)?.user 
    : null;

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStartCall = (isVideo: boolean) => {
    setCallState({
      isActive: true,
      user: selectedUser || undefined,
      isVideo,
      isMuted: false,
      isVideoOff: false,
      duration: 0
    });
  };

  const handleEndCall = () => {
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

  const currentUserWithStatus = { ...currentUser, status: userStatus };

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
    <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SplashScreen isVisible={showSplash} />
      
      {!showSplash && (
        <>
          <Sidebar
            currentUser={currentUserWithStatus}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
            onStatusChange={setUserStatus}
            onShowSettings={() => setShowSettings(true)}
            onLogout={() => setShowLogoutConfirmation(true)}
            activeView={activeView}
            onViewChange={setActiveView}
          />
          
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
                  />
                  
                  <ChatWindow
                    selectedUser={selectedUser}
                    messages={selectedChatId === '1' ? messages : []}
                    currentUserId={currentUser.id}
                    onSendMessage={handleSendMessage}
                    onStartCall={handleStartCall}
                    onShowUserProfile={() => setShowProfilePanel(true)}
                    isDarkMode={isDarkMode}
                    colorPalette={settings.colorPalette}
                  />
                </>
              ) : (
                selectedUser && (
                  <ProfilePanel
                    user={selectedUser}
                    onBack={() => setShowProfilePanel(false)}
                    onStartCall={handleStartCall}
                    isDarkMode={isDarkMode}
                  />
                )
              )}
            </>
          )}
          
          {activeView !== 'chats' && (
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
            onToggleDarkMode={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
          />
          
          {selectedUser && (
            <UserProfile
              user={selectedUser}
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