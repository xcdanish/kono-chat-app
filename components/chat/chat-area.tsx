"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActiveChat, setIsTyping } from "@/lib/slices/chatSlice";
import { useGetChatMessagesQuery, useAskQuestionMutation } from "@/lib/api/chatApi";
import { useUploadPDFMutation } from "@/lib/api/pdfApi";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: File[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pdfId?: string;
  messageCount?: number;
}

interface ChatAreaProps {
  chat: Chat | null;
  onUpdateChat: (chat: Chat) => void;
  onChatListUpdate?: () => void; // Add new optional prop
}

export function ChatArea({
  chat,
  onUpdateChat,
  onChatListUpdate,
}: ChatAreaProps) {
  const dispatch = useAppDispatch();
  const isTyping = useAppSelector((state) => state.chat.isTyping);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [askError, setAskError] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Memoize expensive operations
  const chatId = chat?.id;
  const shouldSkipQuery = !chatId;
  
  const { data: messagesData } = useGetChatMessagesQuery(chat?.id || '', {
    skip: shouldSkipQuery,
    refetchOnMountOrArgChange: true, // Always refetch when component mounts or args change
  });
  const [askQuestion] = useAskQuestionMutation();
  const [uploadPDF] = useUploadPDFMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    if (messagesData?.result?.messages) {
      const apiMessages: Message[] = messagesData.result.messages
        // .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          id: msg._id,
          content: msg.text,
          // sender: msg.role === "user" ? "user" : "ai",
           sender: msg.role === "user" ? "user" : msg.role === "assistant" ? "ai" : "system",
          timestamp: msg.createdAt, // <-- store as string, not Date object!
        }));
      
      setLocalMessages(apiMessages);
    }
  }, [messagesData]);

  useEffect(() => {
    if (chat?.id) {
      // Only clear messages when switching to a different chat
      // Don't clear if it's the same chat being selected again
      if (!messagesData?.result?.messages) {
        setLocalMessages([]);
      }
    } else {
      setLocalMessages([]);
    }
  }, [chat?.id, messagesData?.result?.messages]);

  const handleSendMessage = async (content: string, files?: FileList) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    if (!chat) {
      // If no chat exists and user is sending a message, we need a PDF first
      return;
    }

    setIsSendingMessage(true);
    setAskError(null); // Clear previous error
    setRetryMessage(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedChat = {
      ...chat,
      messages: [...localMessages, userMessage],
      title:
        localMessages.length === 0 ? content.slice(0, 30) + "..." : chat.title,
      updatedAt: new Date(),
    };

    setLocalMessages([...localMessages, userMessage]);
    onUpdateChat(updatedChat);

    // Get AI response
    dispatch(setIsTyping(true));
    try {
      const response = await askQuestion({ 
        chatId: chat.id, 
        question: content 
      }).unwrap();
      
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        content: response.result.answer,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
        updatedAt: new Date(),
      };

      setLocalMessages(prev => [...prev, aiMessage]);
      onUpdateChat(finalChat);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAskError("Failed to get a response from the AI. Please try again.");
      setRetryMessage(content);
       toast.error('Failed to get AI response', {
         description: 'There was an error processing your question. Please try again.',
         duration: 4000,
       });
    } finally {
      dispatch(setIsTyping(false));
      setIsSendingMessage(false);
    }
  };

  const handleRetry = async () => {
    if (!retryMessage) return;
    setAskError(null);
    await handleSendMessage(retryMessage);
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileName = file.name;
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Uploading and processing PDF...', {
        description: `Processing ${fileName}`,
        duration: Infinity,
      });

      // Determine upload strategy based on existing chat
      const uploadData = chat?.id 
        ? { file, chatId: chat.id }
        : { file };

      const uploadResponse = await uploadPDF(uploadData).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success('PDF uploaded successfully!', {
        description: `${fileName} has been processed and is ready for chat.`,
        duration: 4000,
      });

      // Handle new chat creation
      if (!chat) {
        const newChat: Chat = {
          id: uploadResponse.data.chatId,
          title: fileName,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          pdfId: uploadResponse.data.pdfId,
        };

        dispatch(setActiveChat(newChat));
        onUpdateChat(newChat);
      }
      
      // Refresh chat list for both new and existing chats
      onChatListUpdate?.();
      
    } catch (error) {
      console.error("Failed to upload PDF and create chat:", error);
      
      // Show error toast
      toast.error('Failed to upload PDF', {
        description: error instanceof Error ? error.message : 'Please try again.',
        duration: 5000,
      });
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <div className="bg-primary/10 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to QueryDocs AI</h2>
          <p className="text-muted-foreground mb-6">
            Start a new conversation by uploading a document to begin analyzing and
            chatting with your PDFs.
          </p>
          <div className="flex flex-col items-center gap-4">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        {localMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md w-full">
              <div className="bg-primary/10 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add a document to this chat</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Upload a PDF to start asking questions about its content.
              </p>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {localMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Typing indicator: only show when isTyping is true */}
              {isTyping && (
                <div className="flex items-center gap-3 p-4">
                  <div className="bg-accent p-2 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-accent rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {askError && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 flex items-center justify-between gap-4">
                  <div>
                    <strong>Error:</strong> {askError}
                  </div>
                  <button
                    className="bg-destructive text-white px-3 py-1 rounded hover:bg-destructive/80"
                    onClick={handleRetry}
                  >
                    Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onFileUpload={handleFileUpload}
          disabled={isSendingMessage}
        />
      </div>
    </div>
  );
}
