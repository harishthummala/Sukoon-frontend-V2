'use client';

import { forwardRef } from 'react';
import { ChatMessage } from '@/lib/api';
interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(({ messages }, ref) => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-6 sm:px-8 sm:py-6">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-muted-foreground">Start chatting to begin your wellness session</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-3 sm:max-w-md sm:px-6 sm:py-4 lg:max-w-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-white border-2 border-border text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 opacity-70 ${
                    message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={ref} />
        </>
      )}
    </div>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
