import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api';

export interface ChatMessage {
  _id: string;
  chatId: string;
  role: 'system' | 'user' | 'assistant';
  text: string;
  createdAt: string;
  __v: number;
}

export interface Chat {
  _id: string;
  userId: string;
  name?: string;
  createdAt: string;
  __v: number;
}

export interface ChatListResponse {
  message: string;
  success: boolean;
  result: {
    chats: Chat[];
  };
}

export interface MessagesResponse {
  message: string;
  success: boolean;
  result: {
    messages: ChatMessage[];
  };
}

export interface CreateChatResponse {
  message: string;
  success: boolean;
  result: {
    chat: Chat;
  };
}

export interface AskQuestionRequest {
  chatId: string;
  question: string;
}

export interface AskQuestionResponse {
  message: string;
  success: boolean;
  result: {
    answer: string;
  };
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/chat`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token || 
                   (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Chat', 'Message'],
  endpoints: (builder) => ({
    getChats: builder.query<ChatListResponse, void>({
      query: () => '/list',
      providesTags: ['Chat'],
      // Add caching for better performance
      keepUnusedDataFor: 60, // Keep data for 60 seconds
    }),
    createChat: builder.mutation<CreateChatResponse, void>({
      query: () => ({
        url: '/create',
        method: 'POST',
      }),
      invalidatesTags: ['Chat'],
    }),
    getChatMessages: builder.query<MessagesResponse, string>({
      query: (chatId) => `/${chatId}/messages`,
      providesTags: (result, error, chatId) => [
        { type: 'Message', id: chatId },
      ],
      // Add caching for messages
      keepUnusedDataFor: 30,
    }),
    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `/${chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
      // Optimistic update for better UX
      async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getChats', undefined, (draft) => {
            if (draft.result?.chats) {
              draft.result.chats = draft.result.chats.filter(chat => chat._id !== chatId);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    askQuestion: builder.mutation<AskQuestionResponse, AskQuestionRequest>({
      query: (data) => ({
        url: `${API_BASE_URL}/pdf/ask`, // <-- Use full URL here!
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: chatId },
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useCreateChatMutation,
  useGetChatMessagesQuery,
  useDeleteChatMutation,
  useAskQuestionMutation,
} = chatApi;