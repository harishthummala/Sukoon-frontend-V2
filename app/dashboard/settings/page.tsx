'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Lock, Bell, LogOut, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // This would call your backend API
      // For now, just show a success message
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-6 border-b border-border bg-white/50 backdrop-blur-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl space-y-8">
          {/* Profile Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <p className="px-4 py-2 rounded-lg bg-muted text-foreground">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <p className="px-4 py-2 rounded-lg bg-muted text-foreground">{user?.email}</p>
              </div>
              <p className="text-xs text-muted-foreground">Profile information cannot be changed yet. Please contact support to update your details.</p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
            <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-4">
              {error && (
                <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                  <span className="text-sm">✓ {success}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-border"
                  />
                  Show passwords
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            <div className="p-6 rounded-2xl bg-white border-2 border-border space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive updates and tips via email' },
                { key: 'sms', label: 'SMS Reminders', description: 'Get SMS reminders for check-ins' },
                { key: 'push', label: 'Push Notifications', description: 'Receive push notifications on your device' },
              ].map(({ key, label, description }) => (
                <label key={key} className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
            <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200 space-y-4">
              <p className="text-sm text-red-800">Be careful! These actions cannot be undone.</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
