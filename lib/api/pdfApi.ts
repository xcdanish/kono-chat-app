import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/api';

export interface PDFUploadResponse {
  success: boolean;
  message: string;
  data: {
    pdfId: string;
    chatId: string;
  };
}

export const pdfApi = createApi({
  reducerPath: 'pdfApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/pdf`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token || 
                   (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Don't set Content-Type for FormData, let the browser set it
      return headers;
    },
  }),
  tagTypes: ['PDF', 'Chat'],
  endpoints: (builder) => ({
    uploadPDF: builder.mutation<PDFUploadResponse, { file: File; chatId?: string }>({
      query: ({ file, chatId }) => {
        const formData = new FormData();
        formData.append('pdf', file);
        if (chatId) {
          formData.append('chatId', chatId);
        }
        
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['PDF', 'Chat'],
    }),
  }),
});

export const { useUploadPDFMutation } = pdfApi;