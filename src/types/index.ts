export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'dnd' | 'invisible';
  lastSeen?: string;
  email?: string;
  phone?: string;
  isOnline?: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Friend {
  id: string;
  user: User;
  addedAt: string;
}

export interface GroupMember {
  user: User;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: string;
  isGroup: true;
}

export interface Chat {
  id: string;
  user?: User;
  group?: Group;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTyping?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  reactions?: { emoji: string; users: string[] }[];
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  replyTo?: string;
  editedAt?: string;
  status: 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';
}

export interface CallState {
  isActive: boolean;
  user?: User;
  group?: Group;
  isVideo: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  duration: number;
  participants?: User[];
}

export interface CallHistory {
  id: string;
  participants: User[];
  type: 'voice' | 'video';
  duration: number;
  timestamp: string;
  status: 'completed' | 'missed' | 'declined';
  isGroup: boolean;
  groupName?: string;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'message' | 'call' | 'group_invite' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionData?: any;
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

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
}