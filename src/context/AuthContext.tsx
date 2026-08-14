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
  getSessionUserId,
  getUsers,
  saveUsers,
  setSessionUserId,
  uid,
} from "@/lib/storage";
import type { Skill, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  refreshUsers: () => void;
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getUsers());
    setUserId(getSessionUserId());
  }, []);

  const user = useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);

  const refreshUsers = useCallback(() => setUsers(getUsers()), []);

  const login = useCallback((email: string, password: string) => {
    const list = getUsers();
    const found = list.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password" };
    setSessionUserId(found.id);
    setUserId(found.id);
    setUsers(list);
    return { ok: true };
  }, []);

  const signup = useCallback(
    (data: { name: string; username: string; email: string; password: string }) => {
      const list = getUsers();
      if (list.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { ok: false, error: "Email already registered" };
      }
      if (list.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
        return { ok: false, error: "Username taken" };
      }
      if (data.password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters" };
      }
      const initials = data.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      const next: User = {
        id: uid("u"),
        name: data.name.trim(),
        username: data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        bio: "New to Code Connect Hub — say hello!",
        avatar: initials || "CC",
        location: "",
        skills: ["React", "TypeScript"] as Skill[],
        createdAt: new Date().toISOString(),
      };
      const updated = [...list, next];
      saveUsers(updated);
      setUsers(updated);
      setSessionUserId(next.id);
      setUserId(next.id);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    setSessionUserId(null);
    setUserId(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!userId) return;
      const list = getUsers();
      const updated = list.map((u) => (u.id === userId ? { ...u, ...patch, id: u.id } : u));
      saveUsers(updated);
      setUsers(updated);
    },
    [userId]
  );

  const getUserById = useCallback((id: string) => users.find((u) => u.id === id), [users]);
  const getUserByUsername = useCallback(
    (username: string) => users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
    [users]
  );

  const value = useMemo(
    () => ({
      user,
      users,
      login,
      signup,
      logout,
      updateProfile,
      refreshUsers,
      getUserById,
      getUserByUsername,
    }),
    [user, users, login, signup, logout, updateProfile, refreshUsers, getUserById, getUserByUsername]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
