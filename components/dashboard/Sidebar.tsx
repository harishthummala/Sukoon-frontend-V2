'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { chatAPI, notesAPI } from '@/lib/api';
import { NOTES_CHANGED_EVENT } from '@/lib/events';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu, X, MessageSquare, FileText,
  LogOut, Plus, Trash2
} from 'lucide-react';

interface ChatSession {
  id: string;
  mood: string;
  title: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  createdAt: string;
}

interface ContextMenu {
  x: number;
  y: number;
  chatId: string;
}

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab: 'chats' | 'notes' = pathname?.startsWith('/dashboard/notes') ? 'notes' : 'chats';

  useEffect(() => {
    const syncSidebarState = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    syncSidebarState();
    window.addEventListener('resize', syncSidebarState);
    return () => window.removeEventListener('resize', syncSidebarState);
  }, []);

  const loadData = useCallback(async () => {
    if(!token) return;
    try {
      setLoading(true);
      if(activeTab === 'chats') {
        const data = await chatAPI.getSessions(token);
        setChats(Array.isArray(data) ? data : []);
      } else {
        const data = await notesAPI.getNotes(token);
        setNotes(Array.isArray(data) ? data : []);
      }
    } catch(err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  // Load data when tab, route, or token changes
  useEffect(() => {
    loadData();
  }, [loadData, pathname]);

  useEffect(() => {
    const handleNotesChanged = () => {
      if (activeTab === 'notes') {
        loadData();
      }
    };

    window.addEventListener(NOTES_CHANGED_EVENT, handleNotesChanged);
    return () => window.removeEventListener(NOTES_CHANGED_EVENT, handleNotesChanged);
  }, [activeTab, loadData]);

  // Close context menu on outside click
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (contextMenuRef.current?.contains(event.target as Node)) return;
      setContextMenu(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleRightClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, chatId });
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Delete this chat? This cannot be undone.')) return;

    try {
      await chatAPI.deleteSession(chatId, token!);
      setChats(prev => prev.filter(c => c.id !== chatId));
      setContextMenu(null);
      // If currently viewing deleted chat, go to dashboard
      if(pathname === `/dashboard/chat/${chatId}`) {
        router.push('/dashboard');
      }
    } catch(err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊', calm: '😌', neutral: '😐', sad: '😢',
      anxious: '😰', stressed: '😤', angry: '😠', tired: '😴',
    };
    return emojis[mood?.toLowerCase()] || '💭';
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-primary text-primary-foreground shadow-lg lg:hidden"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
        aria-label="Dashboard navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border space-y-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Sukoon
          </Link>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/10">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-2">
          {/* New Chat Button */}
          <Link
            href="/dashboard"
            onClick={closeMobileSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              pathname === '/dashboard'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Plus className="w-5 h-5" />
            New Chat
          </Link>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 mb-3">
            <button
              onClick={() => {
                router.push('/dashboard');
                closeMobileSidebar();
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'chats'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-sidebar-accent'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chats
            </button>
            <button
              onClick={() => {
                router.push('/dashboard/notes');
                closeMobileSidebar();
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'notes'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-sidebar-accent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Notes
            </button>
          </div>

          {/* Chat History */}
          {activeTab === 'chats' && (
            <div className="space-y-1">
              {loading ? (
                <div className="space-y-2 px-2 py-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 rounded-lg bg-sidebar-accent/20 animate-pulse" />
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    No chats yet. Start a new chat!
                  </p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onContextMenu={(e) => handleRightClick(e, chat.id)}
                    className={`group flex items-stretch gap-1 rounded-lg ${
                      pathname === `/dashboard/chat/${chat.id}`
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Link
                      href={`/dashboard/chat/${chat.id}`}
                      onClick={closeMobileSidebar}
                      className="flex min-w-0 flex-1 items-start gap-2 px-3 py-3 text-sm transition"
                    >
                      <span className="text-base mt-0.5 flex-shrink-0">
                        {getMoodEmoji(chat.mood)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chat.title}</p>
                        <p className="text-xs opacity-70 mt-0.5">
                          {formatDate(chat.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className={`mr-1 my-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 ${
                        pathname === `/dashboard/chat/${chat.id}`
                          ? 'text-primary-foreground hover:bg-primary-foreground/15'
                          : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                      }`}
                      aria-label={`Delete ${chat.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes List */}
          {activeTab === 'notes' && (
            <div className="space-y-1">
              <Link
                href="/dashboard/notes/new"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition"
              >
                <Plus className="w-4 h-4" />
                New Note
              </Link>

              <div className="space-y-1 pt-1">
                {loading ? (
                  <div className="space-y-2 px-2 py-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-12 rounded-lg bg-sidebar-accent/20 animate-pulse" />
                    ))}
                  </div>
                ) : notes.length === 0 ? (
                  <div className="px-2 py-8 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">
                      No notes yet. Create one!
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/dashboard/notes/${note.id}`}
                      onClick={closeMobileSidebar}
                      className={`block px-3 py-2 rounded-lg text-sm transition ${
                        pathname === `/dashboard/notes/${note.id}`
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-sidebar-accent'
                      }`}
                    >
                      <p className="font-medium truncate">{note.title}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatDate(note.createdAt)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
          className="bg-white border border-border rounded-lg shadow-lg py-1 min-w-[160px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChat(contextMenu.chatId);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Chat
          </button>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
