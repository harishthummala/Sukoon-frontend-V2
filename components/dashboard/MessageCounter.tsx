'use client';

import { AlertCircle } from 'lucide-react';

interface MessageCounterProps {
  count: number;
  limit: number;
  loading?: boolean;
}

export default function MessageCounter({ count, limit, loading }: MessageCounterProps) {
  const remaining = limit - count;
  const percentage = (count / limit) * 100;
  const isWarning = remaining <= 5;
  const isLimitReached = remaining <= 0;

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
        <div className="animate-spin">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 ${
      isLimitReached
        ? 'border-destructive bg-destructive/10'
        : isWarning
        ? 'border-yellow-400 bg-yellow-50'
        : 'border-primary/20 bg-primary/5'
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {isWarning && <AlertCircle className="w-4 h-4 text-yellow-600" />}
          <p className={`font-semibold ${
            isLimitReached
              ? 'text-destructive'
              : isWarning
              ? 'text-yellow-700'
              : 'text-primary'
          }`}>
            {remaining} messages left
          </p>
        </div>
        <div className="w-48 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isLimitReached
                ? 'bg-destructive'
                : isWarning
                ? 'bg-yellow-400'
                : 'bg-primary'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {count} / {limit} messages used
        </p>
      </div>
    </div>
  );
}
