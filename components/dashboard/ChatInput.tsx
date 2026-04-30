'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  sending: boolean;
}

export default function ChatInput({ onSendMessage, sending }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sending) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-border bg-white/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={sending}
          className="min-h-12 flex-1 rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 sm:px-6"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          aria-label={sending ? 'Sending message' : 'Send message'}
        >
          {sending ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
