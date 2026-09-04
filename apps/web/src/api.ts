export type ProjectStatus = "LIVE" | "IN_PROGRESS" | "SHIPPED";

export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  url?: string | null;
  repoUrl?: string | null;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  available: boolean;
}

export interface WritingStats {
  totalNotes: number;
  totalWords: number;
  averageWordsPerNote: number;
  longestStreakDays: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const ART_URL = import.meta.env.VITE_ART_URL;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getProjects: () => request<Project[]>(`${API_URL}/api/projects`),

  getNotes: () => request<Note[]>(`${API_URL}/api/notes`),

  getAvailability: (month: string) =>
    request<AvailabilitySlot[]>(
      `${API_URL}/api/calendar/availability?month=${month}`
    ),

  book: (payload: { slotId: string; name: string; email: string; message?: string }) =>
    request(`${API_URL}/api/calendar/book`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  sendContact: (payload: { name: string; email: string; message: string }) =>
    request(`${API_URL}/api/contact`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const art = {
  wallpaperUrl: (seed: string) => `${ART_URL}/wallpaper.svg?seed=${encodeURIComponent(seed)}`,
  getWritingStats: () => request<WritingStats>(`${ART_URL}/stats/writing`),
};
