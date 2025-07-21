import React, { useState } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, X, Reply, Edit, Trash2, Check, CheckCheck, Users, Crown } from 'lucide-react';
import { User, Message, Group, UploadProgress } from '../types';

interface ChatWindowProps {
  selectedUser?: User;
  selectedGroup?: Group;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, replyTo?: string) => void;
  onStartCall: (isVideo: boolean) => void;
  onShowUserProfile: () => void;
  isDarkMode: boolean;
  colorPalette: string;
  uploadProgress: UploadProgress[];
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress[]>>;
  onShowGroupManagement: () => void;
}

export default function ChatWindow({ 
  selectedUser,
  selectedGroup,
  messages, 
  currentUserId, 
  onSendMessage, 
  onStartCall,
  onShowUserProfile,
  isDarkMode,
  colorPalette,
  uploadProgress,
  setUploadProgress,
  onShowGroupManagement
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, replyingTo?.id);
      setNewMessage('');
      setReplyingTo(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setShowFilePreview(true);
    }
  };

  const handleSendFiles = () => {
    selectedFiles.forEach((file, index) => {
      const uploadId = Date.now().toString() + index;
      const newUpload: UploadProgress = {
        id: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadProgress(prev => [...prev, newUpload]);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => prev.map(upload => {
          if (upload.id === uploadId) {
            const newProgress = Math.min(upload.progress + 10, 100);
            return {
              ...upload,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return upload;
        }));
      }, 200);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => prev.filter(upload => upload.id !== uploadId));
        
        // Add message to chat
        const fileMessage = `📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        onSendMessage(fileMessage);
      }, 3000);
    });
    
    setSelectedFiles([]);
    setShowFilePreview(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emojis = ['😀', '😂', '😍', '👍', '❤️', '😢', '😮', '😡'];

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadId = Date.now().toString();
      const newUpload: UploadProgress = {
        id: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadProgress(prev => [...prev, newUpload]);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => prev.map(upload => {
          if (upload.id === uploadId) {
            const newProgress = Math.min(upload.progress + 10, 100);
            return {
              ...upload,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return upload;
        }));
      }, 200);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => prev.filter(upload => upload.id !== uploadId));
      }, 3000);
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3" style={{ color: colors.primary }} />;
      case 'failed':
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className={`
        flex-1 
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} 
        flex items-center justify-center
        ${selectedChatId ? 'flex' : 'hidden lg:flex'}
      `}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
            <Send className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome to KoNo
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    dnd: 'bg-red-500',
    invisible: 'bg-gray-400'
  };

  const statusLabels = {
    online: 'Online',
    away: 'Away',
    dnd: 'Do not disturb',
    invisible: 'Offline'
  };

  const isGroup = !!selectedGroup;
  const displayName = selectedUser?.name || selectedGroup?.name;
  const displayAvatar = selectedUser?.avatar || selectedGroup?.avatar;
  const displayStatus = selectedUser ? statusLabels[selectedUser.status] : `${selectedGroup?.members.length} members`;

  // Check if current user is admin for group calls
  const canStartGroupCall = !isGroup || selectedGroup?.members.find(m => m.user.id === currentUserId)?.role === 'admin';

  return (
    <div className={`
      flex-1 
      ${isDarkMode ? 'bg-gray-900' : 'bg-white'} 
      flex flex-col
      ${selectedChatId ? 'flex' : 'hidden lg:flex'}
    `}>
      {/* Mobile Header */}
      <div className={`lg:hidden p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center space-x-3`}>
        <button
          onClick={() => window.history.back()}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
        >
          <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="relative">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
            )}
            {selectedUser && (
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[selectedUser.status]} rounded-full border-2 border-white`}></div>
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{displayName}</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{displayStatus}</p>
          </div>
        </div>
      </div>

      {/* Chat Header */}
      <div className={`hidden lg:block p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.primary}dd)` }}
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
            onClick={onShowUserProfile}
          >
            <div className="relative">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              )}
              {selectedUser && (
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColors[selectedUser.status]} rounded-full border-2 border-white`}></div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">{displayName}</h3>
                {isGroup && <Users className="w-4 h-4 text-blue-100" />}
              </div>
              <p className="text-sm text-blue-100">{displayStatus}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onStartCall(false)}
              disabled={isGroup && !canStartGroupCall}
              className={`p-2 text-white rounded-lg transition-colors ${
                isGroup && !canStartGroupCall 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/20'
              }`}
              title={isGroup && !canStartGroupCall ? 'Only admins can start group calls' : 'Voice call'}
            >
              <Phone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onStartCall(true)}
              disabled={isGroup && !canStartGroupCall}
              className={`p-2 text-white rounded-lg transition-colors ${
                isGroup && !canStartGroupCall 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/20'
              }`}
              title={isGroup && !canStartGroupCall ? 'Only admins can start group calls' : 'Video call'}
            >
              <Video className="w-5 h-5" />
            </button>
            <button 
              onClick={isGroup ? onShowGroupManagement : onShowUserProfile}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          const replyToMessage = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;
          
          // Get sender info for group messages
          const sender = isGroup && !isOwnMessage 
            ? selectedGroup?.members.find(m => m.user.id === message.senderId)?.user
            : null;
          
          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] lg:max-w-md group relative`}>
                {/* Group message sender name */}
                {isGroup && !isOwnMessage && sender && (
                  <p className={`text-xs mb-1 ml-2 font-medium`} style={{ color: colors.primary }}>
                    {sender.name}
                  </p>
                )}
                
                {/* Reply indicator */}
                {replyToMessage && (
                  <div className={`mb-2 p-2 rounded-lg border-l-4 ${
                    isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Replying to {replyToMessage.senderId === currentUserId ? 'yourself' : 'message'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                      {replyToMessage.content}
                    </p>
                  </div>
                )}
                
                <div className={`px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? 'text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                style={isOwnMessage ? { backgroundColor: colors.primary } : {}}>
                  {message.type === 'file' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">{message.fileName}</span>
                      <span className="text-xs opacity-70">{message.fileSize}</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${isOwnMessage ? 'text-white opacity-70' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                      {message.editedAt && ' (edited)'}
                    </p>
                    {isOwnMessage && (
                      <div className="ml-2">
                        {getMessageStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex space-x-1 mt-2">
                      {message.reactions.map((reaction, index) => (
                        <span key={index} className="text-xs bg-white/20 rounded-full px-2 py-1">
                          {reaction.emoji} {reaction.users.length}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Message actions */}
                <div className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <div className={`flex space-x-1 p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setReplyingTo(message)}
                      className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                      title="Reply"
                    >
                      <Reply className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                    {isOwnMessage && (
                      <>
                        <button
                          onClick={() => setEditingMessage(message.id)}
                          className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                          title="Edit"
                        >
                          <Edit className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Upload Progress */}
        {uploadProgress.map((upload) => (
          <div key={upload.id} className="flex justify-end">
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">{upload.fileName}</span>
              </div>
              <div className={`w-full bg-gray-300 rounded-full h-2`}>
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${upload.progress}%`,
                    backgroundColor: upload.status === 'failed' ? '#EF4444' : colors.primary
                  }}
                ></div>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {upload.status === 'uploading' ? `${upload.progress}%` : 
                 upload.status === 'completed' ? 'Uploaded' : 'Failed'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview Modal */}
      {showFilePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Send {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
              </h3>
              <button
                onClick={() => setShowFilePreview(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className={`relative p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    {file.type.startsWith('image/') ? (
                      <img
                        src={getFilePreview(file)!}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    ) : file.type.startsWith('video/') ? (
                      <video
                        src={getFilePreview(file)!}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                        controls
                      />
                    ) : (
                      <div className={`w-full h-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-2 flex items-center justify-center`}>
                        <Paperclip className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    )}
                    
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {file.name}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex space-x-3`}>
              <button
                onClick={() => setShowFilePreview(false)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendFiles}
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: colors.primary }}
              >
                Send Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply indicator */}
      {replyingTo && (
        <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Replying to: {replyingTo.content.substring(0, 50)}...
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            >
              <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className={`p-2 lg:p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="relative">
          <div className="flex items-end space-x-3">
            <label className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors cursor-pointer`}>
              <Paperclip className="w-5 h-5" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                multiple
              />
            </label>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:border-transparent`}
                style={{ focusRingColor: colors.primary }}
              />
              
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
              >
                <Smile className="w-5 h-5" />
              </button>
              
              {showEmojiPicker && (
                <div className={`absolute bottom-full right-0 mb-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border p-3 grid grid-cols-4 gap-2`}>
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setNewMessage(newMessage + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`text-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded p-1 transition-colors`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
              style={{ 
                backgroundColor: !newMessage.trim() ? '#9CA3AF' : colors.primary
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}