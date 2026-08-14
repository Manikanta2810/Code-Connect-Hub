import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getConnections,
  getMessages,
  getProjects,
  saveConnections,
  saveMessages,
  saveProjects,
  uid,
} from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { Connection, Message, Project, ProjectStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";

export type ProjectInput = {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: ProjectStatus;
  repoUrl?: string;
  liveUrl?: string;
  lookingFor: string[];
};

interface DataContextValue {
  projects: Project[];
  connections: Connection[];
  messages: Message[];
  createProject: (input: ProjectInput) => Project | null;
  updateProject: (id: string, input: Partial<ProjectInput>) => void;
  deleteProject: (id: string) => void;
  toggleLike: (projectId: string) => void;
  requestConnection: (toId: string, message: string) => { ok: boolean; error?: string };
  respondConnection: (id: string, accept: boolean) => void;
  sendMessage: (connectionId: string, body: string) => void;
  getProjectBySlug: (slug: string) => Project | undefined;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const refresh = useCallback(() => {
    setProjects(getProjects());
    setConnections(getConnections());
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = useCallback(
    (input: ProjectInput) => {
      if (!user) return null;
      const base = slugify(input.title) || "project";
      const existing = getProjects();
      let slug = base;
      let i = 1;
      while (existing.some((p) => p.slug === slug)) {
        slug = `${base}-${i++}`;
      }
      const now = new Date().toISOString();
      const project: Project = {
        id: uid("p"),
        title: input.title.trim(),
        slug,
        description: input.description.trim(),
        longDescription: input.longDescription.trim(),
        tags: input.tags,
        status: input.status,
        repoUrl: input.repoUrl?.trim() || undefined,
        liveUrl: input.liveUrl?.trim() || undefined,
        ownerId: user.id,
        lookingFor: input.lookingFor,
        likes: [],
        createdAt: now,
        updatedAt: now,
      };
      const next = [project, ...existing];
      saveProjects(next);
      setProjects(next);
      return project;
    },
    [user]
  );

  const updateProject = useCallback(
    (id: string, input: Partial<ProjectInput>) => {
      if (!user) return;
      const next = getProjects().map((p) => {
        if (p.id !== id || p.ownerId !== user.id) return p;
        return {
          ...p,
          ...input,
          title: input.title?.trim() ?? p.title,
          description: input.description?.trim() ?? p.description,
          longDescription: input.longDescription?.trim() ?? p.longDescription,
          repoUrl: input.repoUrl !== undefined ? input.repoUrl.trim() || undefined : p.repoUrl,
          liveUrl: input.liveUrl !== undefined ? input.liveUrl.trim() || undefined : p.liveUrl,
          updatedAt: new Date().toISOString(),
        };
      });
      saveProjects(next);
      setProjects(next);
    },
    [user]
  );

  const deleteProject = useCallback(
    (id: string) => {
      if (!user) return;
      const next = getProjects().filter((p) => !(p.id === id && p.ownerId === user.id));
      saveProjects(next);
      setProjects(next);
    },
    [user]
  );

  const toggleLike = useCallback(
    (projectId: string) => {
      if (!user) return;
      const next = getProjects().map((p) => {
        if (p.id !== projectId) return p;
        const liked = p.likes.includes(user.id);
        return {
          ...p,
          likes: liked ? p.likes.filter((id) => id !== user.id) : [...p.likes, user.id],
        };
      });
      saveProjects(next);
      setProjects(next);
    },
    [user]
  );

  const requestConnection = useCallback(
    (toId: string, message: string) => {
      if (!user) return { ok: false, error: "Sign in required" };
      if (toId === user.id) return { ok: false, error: "Cannot connect to yourself" };
      const list = getConnections();
      const exists = list.find(
        (c) =>
          (c.fromId === user.id && c.toId === toId) ||
          (c.fromId === toId && c.toId === user.id)
      );
      if (exists) {
        return {
          ok: false,
          error: exists.status === "accepted" ? "Already connected" : "Request already pending",
        };
      }
      const next: Connection = {
        id: uid("c"),
        fromId: user.id,
        toId,
        status: "pending",
        message: message.trim() || "Would love to connect!",
        createdAt: new Date().toISOString(),
      };
      const updated = [next, ...list];
      saveConnections(updated);
      setConnections(updated);
      return { ok: true };
    },
    [user]
  );

  const respondConnection = useCallback(
    (id: string, accept: boolean) => {
      if (!user) return;
      let list = getConnections();
      if (accept) {
        list = list.map((c) =>
          c.id === id && c.toId === user.id ? { ...c, status: "accepted" as const } : c
        );
      } else {
        list = list.filter((c) => !(c.id === id && c.toId === user.id));
      }
      saveConnections(list);
      setConnections(list);
    },
    [user]
  );

  const sendMessage = useCallback(
    (connectionId: string, body: string) => {
      if (!user || !body.trim()) return;
      const conn = getConnections().find((c) => c.id === connectionId && c.status === "accepted");
      if (!conn || (conn.fromId !== user.id && conn.toId !== user.id)) return;
      const msg: Message = {
        id: uid("m"),
        connectionId,
        senderId: user.id,
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };
      const next = [...getMessages(), msg];
      saveMessages(next);
      setMessages(next);
    },
    [user]
  );

  const getProjectBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects]
  );

  const value = useMemo(
    () => ({
      projects,
      connections,
      messages,
      createProject,
      updateProject,
      deleteProject,
      toggleLike,
      requestConnection,
      respondConnection,
      sendMessage,
      getProjectBySlug,
      refresh,
    }),
    [
      projects,
      connections,
      messages,
      createProject,
      updateProject,
      deleteProject,
      toggleLike,
      requestConnection,
      respondConnection,
      sendMessage,
      getProjectBySlug,
      refresh,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
