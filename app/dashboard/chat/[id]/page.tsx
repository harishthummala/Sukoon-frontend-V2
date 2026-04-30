'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { chatAPI, ChatMessage, ChatSession } from '@/lib/api/chat';
import { useParams } from 'next/navigation';
import ChatWindow from '@/components/dashboard/ChatWindow';
import ChatInput from '@/components/dashboard/ChatInput';
import MessageCounter from '@/components/dashboard/MessageCounter';
import SessionSummary from '@/components/dashboard/SessionSummary';
import { AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [messageLimit, setMessageLimit] = useState(20);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token && id) {
      loadSession();
      fetchMessageCount();
    }
  }, [token, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await chatAPI.getSession(id as string, token!);
      setSession(data);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const response = await chatAPI.getMessageCount(id as string, token!);
      setMessageCount(response.messageCount ?? response.count ?? 0);
      if (typeof response.limit === 'number') {
        setMessageLimit(response.limit);
      }
    } catch(err) {
      console.error('Failed to fetch message count:', err);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (sessionEnded || messageCount >= messageLimit) return;

    setSending(true);
    setError('');

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sessionId: id as string,
        content,
        sender: 'user',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send to backend
      await chatAPI.sendMessage(id as string, content, token!);

      // Refresh messages
      const updatedSession = await chatAPI.getSession(id as string, token!);
      setMessages(updatedSession.messages || []);

      // Update message count
      await fetchMessageCount();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);

      // Remove last user message if failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    try {
      await chatAPI.endSession(id as string, token!);
      setSessionEnded(true);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-foreground font-semibold">Chat not found</p>
          <p className="text-muted-foreground">This chat session may have been deleted.</p>
        </div>
      </div>
    );
  }

  if (sessionEnded) {
    return <SessionSummary session={session} messages={messages} />;
  }

  const remaining = messageLimit - messageCount;
  const canSendMore = remaining > 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-background to-primary/5">
      <div className="flex flex-col gap-3 border-b border-border bg-white/50 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold capitalize text-foreground sm:text-2xl">{session.mood} Chat</h1>
          <p className="text-muted-foreground text-sm">Session started {new Date(session.createdAt).toLocaleDateString()}</p>
        </div>
        <MessageCounter count={messageCount} limit={messageLimit} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 sm:mx-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Chat Messages */}
      <ChatWindow messages={messages} ref={messagesEndRef} />

      {/* Chat Input */}
      {canSendMore ? (
        <ChatInput onSendMessage={handleSendMessage} sending={sending} />
      ) : (
        <div className="border-t border-destructive/20 bg-destructive/10 px-4 py-4 sm:px-8">
          <p className="text-destructive font-semibold">Daily message limit reached</p>
          <p className="text-destructive/80 text-sm">Come back tomorrow to continue your wellness journey.</p>
        </div>
      )}

      {/* End Session Button */}
      <div className="border-t border-border bg-white/50 px-4 py-3 sm:px-8 sm:py-4">
        <button
          onClick={handleEndSession}
          disabled={messages.length === 0}
          className="min-h-10 text-sm text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          End Session & View Summary
        </button>
      </div>
    </div>
  );
}
