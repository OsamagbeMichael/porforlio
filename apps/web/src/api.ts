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

const API_URL = import.meta.env.VITE_API_URL;

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
};
