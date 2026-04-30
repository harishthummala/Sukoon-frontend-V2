'use client';

import { ChatSession, ChatMessage } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Clock, BarChart3 } from 'lucide-react';

interface SessionSummaryProps {
  session: ChatSession;
  messages: ChatMessage[];
}

export default function SessionSummary({ session, messages }: SessionSummaryProps) {
  const userMessages = messages.filter((m) => m.sender === 'user');
  const assistantMessages = messages.filter((m) => m.sender === 'assistant');
  const sessionUpdatedAt = session.updatedAt ?? session.createdAt;
  const duration = Math.ceil(
    (new Date(sessionUpdatedAt).getTime() - new Date(session.createdAt).getTime()) / 60000
  );

  const getSummaryText = () => {
    if (messages.length === 0) return 'No messages in this session';
    
    const hasPositive = userMessages.some((m) =>
      /happy|great|good|amazing|wonderful|awesome|excellent|better|positive/i.test(m.content)
    );
    const hasNegative = userMessages.some((m) =>
      /sad|bad|awful|terrible|worst|depressed|anxious|stressed|angry|tired/i.test(m.content)
    );
    const hasReflection = userMessages.some((m) => /understand|realize|think|feel|learn/i.test(m.content));

    let summary = 'You had an ';
    if (session.mood === 'happy' || session.mood === 'calm') {
      summary += 'uplifting chat session. ';
    } else if (session.mood === 'sad' || session.mood === 'anxious' || session.mood === 'stressed') {
      summary += 'important session to process your feelings. ';
    } else if (session.mood === 'angry') {
      summary += 'cathartic session to address your emotions. ';
    } else {
      summary += 'thoughtful chat session. ';
    }

    if (hasReflection) {
      summary += 'You gained valuable insights about yourself. ';
    }
    if (hasPositive && !hasNegative) {
      summary += 'Keep building on this positive momentum!';
    } else if (hasNegative && hasPositive) {
      summary += 'Remember, it&apos;s okay to have mixed feelings.';
    }

    return summary;
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-12 bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Session Summary</h1>
            <p className="text-muted-foreground">Your {session.mood} session from {new Date(session.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="w-5 h-5" />
              <p className="text-sm font-medium">Total Messages</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{messages.length}</p>
            <p className="text-xs text-muted-foreground">{userMessages.length} you, {assistantMessages.length} assistant</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <p className="text-sm font-medium">Duration</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{duration}m</p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="w-5 h-5" />
              <p className="text-sm font-medium">Mood</p>
            </div>
            <p className="text-3xl capitalize text-foreground">{session.mood}</p>
            <p className="text-xs text-muted-foreground">Today&apos;s focus</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">How you did</h2>
          <p className="text-foreground leading-relaxed">{getSummaryText()}</p>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Key Takeaways</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-sm font-medium text-foreground">💭 Reflection</p>
              <p className="text-sm text-muted-foreground mt-1">You shared {userMessages.length} thoughts with yourself</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-sm font-medium text-foreground">🎯 Growth</p>
              <p className="text-sm text-muted-foreground mt-1">Consider keeping a personal note about today&apos;s insights</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border">
              <p className="text-sm font-medium text-foreground">🌱 Next Steps</p>
              <p className="text-sm text-muted-foreground mt-1">Come back tomorrow for another wellness session</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-8">
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition text-center"
          >
            New Chat
          </Link>
          <Link
            href="/dashboard/notes/new"
            className="flex-1 px-6 py-3 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition text-center"
          >
            Create Note
          </Link>
        </div>
      </div>
    </div>
  );
}
