export type Skill =
  | "React"
  | "TypeScript"
  | "Node.js"
  | "Python"
  | "Go"
  | "Rust"
  | "UI/UX"
  | "DevOps"
  | "AI/ML"
  | "Mobile"
  | "GraphQL"
  | "PostgreSQL";

export type ProjectStatus = "idea" | "building" | "shipped" | "seeking";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  location: string;
  website?: string;
  github?: string;
  skills: Skill[];
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: ProjectStatus;
  repoUrl?: string;
  liveUrl?: string;
  ownerId: string;
  lookingFor: string[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted";
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export type PublicUser = Omit<User, "password" | "email"> & {
  email?: string;
};
