import { API_BASE_URL } from '@/lib/config';

const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '')}`,
});

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'assistant';
  createdAt: string;
}

export type ChatMessage = Message;

export interface ChatSession {
  id: string;
  mood: string;
  title: string;
  messages?: Message[];
  createdAt: string;
  updatedAt?: string;
}

export interface MessageCountResponse {
  chatId?: string | number;
  count?: number;
  messageCount?: number;
  limit?: number;
}

export const chatAPI = {
  // V0 calls chatAPI.createSession(mood, token)
  createSession: async (mood: string, token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ mood }),
    });
    return res.json();
  },

  // V0 calls chatAPI.getSessions(token)
  getSessions: async (token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  // V0 calls chatAPI.getSession(id, token)
  getSession: async (id: string, token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${id}`, {
      headers: getHeaders(token),
    });
    return res.json();
  },

  // V0 calls chatAPI.sendMessage(id, message, token)
  sendMessage: async (chatId: string, message: string, token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  // V0 calls chatAPI.endSession(id, token)
  endSession: async (chatId: string, token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/end`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({}),
    });
    return res.json();
  },

  // V0 calls chatAPI.getMessageCount(chatId, token)
  getMessageCount: async (chatId: string, token?: string): Promise<MessageCountResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-message/${chatId}/count`, {
      headers: getHeaders(token),
    });
    const responseText = await res.text();

    if (!res.ok) {
      throw new Error(responseText || `Failed to fetch message count (${res.status})`);
    }

    if (!responseText.trim()) {
      return { count: 0 };
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(`Message count endpoint did not return JSON: ${responseText.slice(0, 120)}`);
    }
  },

  // Add to chatAPI object
  deleteSession: async (chatId: string, token?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/delete`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to delete chat');
    }

    if (res.status === 204) {
      return { success: true };
    }

    const responseText = await res.text();
    if (!responseText) {
      return { success: true };
    }

    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json')
      ? JSON.parse(responseText)
      : { success: true, message: responseText };
  },

  // aliases for flexibility
  create: async (mood: string, token?: string) => 
    chatAPI.createSession(mood, token),
  getAll: async (token?: string) => 
    chatAPI.getSessions(token),
  getById: async (id: string, token?: string) => 
    chatAPI.getSession(id, token),
  end: async (id: string, token?: string) => 
    chatAPI.endSession(id, token),
};
