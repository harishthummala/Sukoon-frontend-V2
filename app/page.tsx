'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Sukoon</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 rounded-lg text-foreground hover:bg-muted transition">
              Log In
            </Link>
            <Link href="/register" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground text-balance">
            Find Your Peace,
            <span className="text-primary"> One Chat at a Time</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Sukoon is your personal AI mental wellness companion. Share your feelings, get support, and discover insights about your emotional wellbeing.
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition text-lg">
            Try Sukoon Free
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Why Sukoon?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Understand Your Feelings</h3>
              <p className="text-muted-foreground">Track your moods and emotions in a safe, private space. Get AI-powered insights about your emotional patterns.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Compassionate Support</h3>
              <p className="text-muted-foreground">Chat with an empathetic AI that listens without judgment. Get personalized guidance whenever you need it.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Personal Reflections</h3>
              <p className="text-muted-foreground">Keep personal notes and reflections. Revisit your thoughts and track your wellness journey over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">How Sukoon Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Select Your Mood', desc: 'Choose from 8 moods to start your session' },
              { step: '2', title: 'Share Your Thoughts', desc: 'Chat naturally about what&apos;s on your mind' },
              { step: '3', title: 'Get Support', desc: 'Receive compassionate AI responses' },
              { step: '4', title: 'Reflect & Grow', desc: 'Review sessions and keep personal notes' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problems Solved */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Problems Sukoon Solves</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-3xl flex-shrink-0">😰</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Mental Health Overwhelm</h3>
                <p className="text-muted-foreground">Struggling to find time for therapy or hesitant to seek help? Sukoon provides instant support 24/7 without judgment.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-3xl flex-shrink-0">🤷</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Lack of Self-Awareness</h3>
                <p className="text-muted-foreground">Struggling to understand your emotions? Sukoon helps you identify patterns and triggers in your emotional life.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-3xl flex-shrink-0">📝</div>
              <div>
                <h3 className="text-xl font-semibold tlsof -i :8080ext-foreground mb-2">No Space to Journal</h3>
                <p className="text-muted-foreground">Keep organized, searchable notes of your thoughts and feelings. Track your progress over time.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-3xl flex-shrink-0">🌙</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Late-Night Anxiety</h3>
                <p className="text-muted-foreground">When you can&apos;t sleep or need someone to talk to at 3 AM, Sukoon is always there for you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-foreground">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-muted-foreground">Join thousands finding peace and clarity with Sukoon.</p>
          <Link href="/register" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition text-lg">
            Get Started Today
          </Link>
        </div>
      </div>

      {/* Terms Section */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="md:col-span-3 text-center max-w-md mx-auto">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About Sukoon</h3>
              <p className="text-sm text-muted-foreground mb-6">Sukoon is an AI-powered mental wellness companion built to support your emotional journey with care and understanding.</p>
            </div>
            {/* <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              </ul>
            </div> */}
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Sukoon. All rights reserved. Sukoon is not a replacement for professional mental health care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
