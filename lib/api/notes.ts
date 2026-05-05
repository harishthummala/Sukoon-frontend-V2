import { API_BASE_URL } from '@/lib/config';

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '')}`,
});

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const normalizeNote = (note: Partial<Note>): Note => ({
  id: String(note.id ?? ''),
  title: note.title || 'Untitled Note',
  content: note.content || '',
  createdAt: note.createdAt || new Date().toISOString(),
  updatedAt: note.updatedAt || note.createdAt || new Date().toISOString(),
});

export const notesAPI = {
  // V0 calls notesAPI.getNotes(token)
  getNotes: async (token?: string) => {
    const res = await fetch(apiUrl('/notes'), {
      headers: getHeaders(token),
    });
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeNote) : [];
  },

  getNote: async (id: string, token?: string) => {
    const notes = await notesAPI.getNotes(token);
    const note = notes.find((item) => String(item.id) === String(id));

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  },

  // V0 calls notesAPI.createNote(title, content, token)
  createNote: async (title: string, content: string, token?: string) => {
    const res = await fetch(apiUrl('/notes'), {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  },

  // V0 calls notesAPI.updateNote(id, title, content, token)
  updateNote: async (id: string, title: string, content: string, token?: string) => {
    const res = await fetch(apiUrl(`/notes/${id}`), {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  },

  // V0 calls notesAPI.deleteNote(id, token)
  deleteNote: async (id: string, token?: string) => {
    const res = await fetch(apiUrl(`/notes/${id}`), {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  },

  // aliases
  getAll: async (token?: string) => notesAPI.getNotes(token),
  getById: async (id: string, token?: string) => notesAPI.getNote(id, token),
  create: async (data: { title: string; content: string }, token?: string) =>
    notesAPI.createNote(data.title, data.content, token),
  update: async (id: string, data: { title: string; content: string }, token?: string) =>
    notesAPI.updateNote(id, data.title, data.content, token),
  delete: async (id: string, token?: string) => 
    notesAPI.deleteNote(id, token),
};
