'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { chatAPI } from '@/lib/api/chat';
import { useRouter } from 'next/navigation';
import MoodSelector from '@/components/dashboard/MoodSelector';
import MessageCounter from '@/components/dashboard/MessageCounter';

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [messageCount, setMessageCount] = useState(0);
  const [messageLimit, setMessageLimit] = useState(20);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (token) {
      fetchMessageCount();
    }
  }, [token]);

  const fetchMessageCount = async () => {
    setMessageCount(0);
    setMessageLimit(20);
    setLoadingCount(false);
  };

  const handleMoodSelect = async (mood: string) => {
    try {
      const session = await chatAPI.createSession(mood, token!);
      router.push(`/dashboard/chat/${session.id}`);
    } catch (err) {
      console.error('Failed to create chat session:', err);
      alert('Failed to create chat session. Please try again.');
    }
  };

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😤', label: 'Stressed', value: 'stressed' },
    { emoji: '😠', label: 'Angry', value: 'angry' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-white/50 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">How are you feeling?</h1>
          <p className="text-muted-foreground mt-1">Select your mood to start a conversation</p>
        </div>
        <MessageCounter count={messageCount} limit={messageLimit} loading={loadingCount} />
      </div>

      {/* Mood Selector */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 sm:px-8 sm:py-12">
          <MoodSelector moods={moods} onSelect={handleMoodSelect} />
        </div>
      </div>
    </div>
  );
}
