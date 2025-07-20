export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: File[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pdfId?: string;
  messageCount?: number;
}

export interface PDFUploadResponse {
  message: string;
  result: {
    id: string;
    filename: string;
    uploadedAt: string;
  };
}

export interface ChatCreateResponse {
  message: string;
  result: {
    id: string;
    pdfId: string;
    createdAt: string;
  };
}

export interface ChatListResponse {
  message: string;
  success: boolean;
  result: {
    chats: Array<{
      _id: string;
      userId: string;
      name?: string;
      createdAt: string;
      __v: number;
    }>;
  };
}

export interface MessagesResponse {
  message: string;
  success: boolean;
  result: {
    messages: Array<{
      _id: string;
      chatId: string;
      role: 'system' | 'user' | 'assistant';
      text: string;
      createdAt: string;
      __v: number;
    }>;
  };
}

export interface AskResponse {
  message: string;
  result: {
    answer: string;
    messageId: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const getAuthHeadersForFormData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export const uploadPDF = async (file: File): Promise<PDFUploadResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
    method: 'POST',
    headers: getAuthHeadersForFormData(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload PDF');
  }

  return await response.json();
};

export const createChat = async (pdfId: string): Promise<ChatCreateResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ pdfId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create chat');
  }

  return await response.json();
};

export const getChatList = async (): Promise<ChatListResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/list`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get chat list');
  }

  return await response.json();
};

export const getChatMessages = async (chatId: string): Promise<MessagesResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get messages');
  }

  return await response.json();
};

export const askQuestion = async (chatId: string, question: string): Promise<AskResponse> => {
  const response = await fetch(`${API_BASE_URL}/pdf/ask`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ chatId, question }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to ask question');
  }

  return await response.json();
};

export const deleteChat = async (chatId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete chat');
  }
};

// Keep backward compatibility functions
export const mockAIResponse = async (message: string): Promise<string> => {
  // This is now deprecated, use askQuestion instead
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "Please use the new API integration for responses.";
};

export const getStoredChats = (): Chat[] => {
  // This will be replaced by API calls
  return [];
};

export const storeChats = (chats: Chat[]) => {
  // This will be replaced by API calls
  return;
};