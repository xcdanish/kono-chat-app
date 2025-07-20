export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'dnd' | 'invisible';
  lastSeen?: string;
  email?: string;
  phone?: string;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  reactions?: { emoji: string; users: string[] }[];
  fileName?: string;
  fileSize?: string;
}

export interface CallState {
  isActive: boolean;
  user?: User;
  isVideo: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  duration: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  colorPalette: 'blue' | 'green' | 'purple' | 'orange';
  fontSize: 'small' | 'medium' | 'large';
  fontStyle: 'inter' | 'roboto' | 'system';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}