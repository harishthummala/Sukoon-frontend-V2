'use client';

import { useState } from 'react';

interface Mood {
  emoji: string;
  label: string;
  value: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ moods, onSelect }: MoodSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (moodValue: string) => {
    setSelected(moodValue);
    setLoading(true);
    try {
      onSelect(moodValue);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            disabled={loading && selected !== mood.value}
            className={`group relative flex min-h-32 flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-300 sm:min-h-40 sm:p-6 ${
              selected === mood.value
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary bg-white hover:bg-primary/5'
            } ${loading && selected !== mood.value ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* Loading Spinner */}
            {loading && selected === mood.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin">
                  <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"></div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`flex flex-col items-center gap-2 ${loading && selected === mood.value ? 'opacity-0' : ''}`}>
              <span className="text-4xl sm:text-5xl">{mood.emoji}</span>
              <span className="font-semibold text-foreground text-center">{mood.label}</span>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-colors" />
          </button>
        ))}
      </div>

      {/* Info Text */}
      <div className="mt-8 rounded-xl border border-secondary/20 bg-secondary/10 p-4 text-center sm:mt-12 sm:p-6">
        <p className="text-foreground font-medium mb-2">Let&apos;s talk about how you&apos;re feeling</p>
        <p className="text-muted-foreground text-sm">
          Share your thoughts and feelings in a safe, judgment-free space. Sukoon is here to listen and support you.
        </p>
      </div>
    </div>
  );
}
