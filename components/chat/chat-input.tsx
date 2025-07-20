'use client';

import { useState, useRef, KeyboardEvent, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, files?: FileList) => Promise<void>;
  onFileUpload?: (files: FileList) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput = memo(function ChatInput({ onSendMessage, onFileUpload, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetForm = useCallback(() => {
    setMessage('');
    setAttachedFiles([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending) {
      setIsSending(true);
      // Clear the input immediately
      resetForm();
      
      try {
        await onSendMessage(trimmedMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    } else if (attachedFiles.length > 0 && onFileUpload) {
      setIsSending(true);
      
      let files: FileList | undefined;
      
      const dataTransfer = new DataTransfer();
      attachedFiles.forEach(file => dataTransfer.items.add(file));
      files = dataTransfer.files;
      
      // Clear the input immediately
      resetForm();
      
      try {
        await onFileUpload(files);
      } catch (error) {
        console.error('Failed to upload files:', error);
      } finally {
        setIsSending(false);
      }
    }
  }, [message, attachedFiles, onSendMessage, onFileUpload, resetForm, isSending]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending && !disabled) {
      e.preventDefault();
      const trimmedMessage = message.trim();
      if (trimmedMessage || attachedFiles.length > 0) {
        handleSend();
      }
    }
  }, [handleSend, isSending, disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0]; // Only take the first file
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
        setAttachedFiles([file]); // Replace any existing file
      } else {
        console.warn('Invalid file type or size. Please upload PDF, DOC, or DOCX files under 10MB.');
      }
    }
    // Clear the input
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setAttachedFiles(files => files.filter((_, i) => i !== index));
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  return (
    <div className="space-y-3">
      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-accent px-3 py-2 rounded-lg text-sm"
            >
              <Paperclip className="h-3 w-3" />
              <span className="truncate max-w-32">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
          
          <div className="absolute right-2 top-2 flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={disabled || isSending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && attachedFiles.length === 0) || disabled || isSending}
          className={cn(
            "h-11 w-11 p-0 shrink-0",
            ((!message.trim() && attachedFiles.length === 0) || disabled || isSending) && "opacity-50"
          )}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});