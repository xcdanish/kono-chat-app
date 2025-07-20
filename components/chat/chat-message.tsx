"use client";

import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

interface Message {
  sender: "user" | "ai" | "system";
  content: string;
  attachments?: { name: string; size: number }[];
}

export const ChatMessage = memo(function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";
  const isSystem = message.sender === "system";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser || isSystem ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-primary text-primary-foreground"
              : isAI
              ? "bg-accent"
              : "bg-muted"
          )}
        >
          {isUser && <User className="h-4 w-4" />}
          {isAI && <Sparkles className="h-4 w-4" />}
          {isSystem && <FileText className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex-1 max-w-[80%]",
          (isUser || isSystem) && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg p-3 prose prose-sm max-w-none",
            isUser
              ? "bg-primary text-primary-foreground ml-auto"
              : isSystem
              ? "bg-muted text-muted-foreground ml-auto"
              : "bg-accent"
          )}
        >
          {message.content &&
            (isSystem ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                {/* <span>Document uploaded</span> */}
                <a
                  href={`${process.env.NEXT_PUBLIC_API}${message.content}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Document uploaded
                </a>
              </div>
            ) : (
              <p className="m-0 whitespace-pre-wrap break-words">
                {message.content}
              </p>
            ))}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="h-3 w-3" />
                  <span className="truncate">{file.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
