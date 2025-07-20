import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatMessage } from '../api/chatApi';

interface ChatState {
  activeChat: Chat | null;
  messages: ChatMessage[];
  isTyping: boolean;
  chats: Chat[];
}

const initialState: ChatState = {
  activeChat: null,
  messages: [],
  isTyping: false,
  chats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
      // Never clear messages here - let the component handle message state
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    clearChat: (state) => {
      state.activeChat = null;
      state.messages = [];
      state.isTyping = false;
    },
  },
});

export const {
  setActiveChat,
  setMessages,
  addMessage,
  setIsTyping,
  setChats,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;