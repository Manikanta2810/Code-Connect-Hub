import { SEED_CONNECTIONS, SEED_PROJECTS, SEED_USERS } from "@/data/seed";
import type { Connection, Message, Project, User } from "@/types";

const KEYS = {
  users: "cch_users",
  projects: "cch_projects",
  connections: "cch_connections",
  messages: "cch_messages",
  session: "cch_session",
  seeded: "cch_seeded",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeeded() {
  if (localStorage.getItem(KEYS.seeded) === "1") return;
  write(KEYS.users, SEED_USERS);
  write(KEYS.projects, SEED_PROJECTS);
  write(KEYS.connections, SEED_CONNECTIONS);
  write(KEYS.messages, [] as Message[]);
  localStorage.setItem(KEYS.seeded, "1");
}

export function getUsers(): User[] {
  ensureSeeded();
  return read(KEYS.users, SEED_USERS);
}

export function saveUsers(users: User[]) {
  write(KEYS.users, users);
}

export function getProjects(): Project[] {
  ensureSeeded();
  return read(KEYS.projects, SEED_PROJECTS);
}

export function saveProjects(projects: Project[]) {
  write(KEYS.projects, projects);
}

export function getConnections(): Connection[] {
  ensureSeeded();
  return read(KEYS.connections, SEED_CONNECTIONS);
}

export function saveConnections(connections: Connection[]) {
  write(KEYS.connections, connections);
}

export function getMessages(): Message[] {
  ensureSeeded();
  return read(KEYS.messages, []);
}

export function saveMessages(messages: Message[]) {
  write(KEYS.messages, messages);
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(KEYS.session);
}

export function setSessionUserId(id: string | null) {
  if (id) localStorage.setItem(KEYS.session, id);
  else localStorage.removeItem(KEYS.session);
}

export function resetDemoData() {
  write(KEYS.users, SEED_USERS);
  write(KEYS.projects, SEED_PROJECTS);
  write(KEYS.connections, SEED_CONNECTIONS);
  write(KEYS.messages, [] as Message[]);
  localStorage.setItem(KEYS.seeded, "1");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
