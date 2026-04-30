'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notesAPI } from '@/lib/api';
import { NOTES_CHANGED_EVENT } from '@/lib/events';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoteEditorPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState('');
  const isNewNote = id === 'new';

  useEffect(() => {
    if (token) {
      if (isNewNote) {
        setNote(null);
        setTitle('');
        setContent('');
        setError('');
        setLoading(false);
      } else {
        loadNote();
      }
    }
  }, [token, id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notesAPI.getNote(id as string, token!);
      setNote(data);
      setTitle(data.title);
      setContent(data.content);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to load note:', err);
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);

    try {
      if (isNewNote) {
        await notesAPI.createNote(title, content, token!);
      } else {
        await notesAPI.updateNote(id as string, title, content, token!);
      }
      window.dispatchEvent(new Event(NOTES_CHANGED_EVENT));
      setHasChanges(false);
      router.push('/dashboard/notes');
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeleting(true);

    try {
      await notesAPI.deleteNote(id as string, token!);
      window.dispatchEvent(new Event(NOTES_CHANGED_EVENT));
      router.push('/dashboard/notes');
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note');
    } finally {
      setDeleting(false);
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-white/50 backdrop-blur-sm">
        <Link
          href="/dashboard/notes"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {isNewNote ? 'New Note' : 'Edit Note'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isNewNote && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg bg-red-50 text-destructive font-medium hover:bg-red-100 disabled:opacity-50 transition flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden p-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasChanges(true);
            }}
            placeholder="Note title..."
            className="text-3xl font-bold text-foreground bg-transparent border-b-2 border-border focus:border-primary outline-none transition pb-4"
          />

          {/* Content Editor */}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setHasChanges(true);
            }}
            placeholder="Write your thoughts here..."
            className="flex-1 w-full px-6 py-4 rounded-2xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />

          {/* Metadata */}
          {note && (
            <div className="text-xs text-muted-foreground text-right">
              <p>Created {new Date(note.createdAt).toLocaleDateString()}</p>
              <p>Last updated {new Date(note.updatedAt).toLocaleDateString()} at {new Date(note.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
