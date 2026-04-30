'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notesAPI } from '@/lib/api';
import { NOTES_CHANGED_EVENT } from '@/lib/events';
import Link from 'next/link';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadNotes();
    }
  }, [token]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesAPI.getNotes(token!);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notesAPI.deleteNote(id, token!);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setDeleteConfirm(null);
      window.dispatchEvent(new Event(NOTES_CHANGED_EVENT));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: notes.some((n) => new Date(n.createdAt).getFullYear() !== new Date().getFullYear())
        ? 'numeric'
        : undefined,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-white/50 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Personal Notes</h1>
          <p className="text-muted-foreground mt-1">Keep track of your thoughts and reflections</p>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-3xl">📝</span>
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-semibold">No notes yet</p>
                <p className="text-muted-foreground text-sm">Create your first note to capture your thoughts</p>
              </div>
              <Link
                href="/dashboard/notes/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
              >
                <Plus className="w-5 h-5" />
                Create Note
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative h-64 p-6 rounded-2xl bg-white border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
              >
                {/* Delete Confirmation */}
                {deleteConfirm === note.id && (
                  <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm flex items-center justify-center p-4 z-10 rounded-2xl">
                    <div className="text-center space-y-4">
                      <p className="font-semibold text-foreground">Delete this note?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/90 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3 h-full flex flex-col">
                  <Link
                    href={`/dashboard/notes/${note.id}`}
                    className="flex-1 overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">{note.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-4">{note.content}</p>
                  </Link>

                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(note.updatedAt)}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/notes/${note.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Open
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(note.id)}
                        className="px-3 py-2 rounded-lg bg-red-50 text-destructive text-sm font-medium hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
