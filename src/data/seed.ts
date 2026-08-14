import type { Connection, Project, User } from "@/types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

export const SEED_USERS: User[] = [
  {
    id: "u1",
    name: "Aisha Rahman",
    username: "aisha",
    email: "aisha@example.com",
    password: "demo1234",
    bio: "Full-stack engineer building tools for remote teams. Open to collabs on DX and developer platforms.",
    avatar: "AR",
    location: "Bengaluru, IN",
    website: "https://aisha.dev",
    github: "aisharahman",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    createdAt: daysAgo(120),
  },
  {
    id: "u2",
    name: "Marcus Chen",
    username: "marcusc",
    email: "marcus@example.com",
    password: "demo1234",
    bio: "Systems + ML. Shipping reliable inference pipelines and clean APIs.",
    avatar: "MC",
    location: "Toronto, CA",
    github: "marcuschen",
    skills: ["Python", "AI/ML", "Go", "DevOps"],
    createdAt: daysAgo(90),
  },
  {
    id: "u3",
    name: "Sofia Alvarez",
    username: "sofia",
    email: "sofia@example.com",
    password: "demo1234",
    bio: "Product designer who codes. Obsessed with accessible interfaces and motion that earns its keep.",
    avatar: "SA",
    location: "Madrid, ES",
    website: "https://sofia.design",
    skills: ["UI/UX", "React", "TypeScript", "Mobile"],
    createdAt: daysAgo(60),
  },
  {
    id: "u4",
    name: "Jordan Lee",
    username: "jlee",
    email: "jordan@example.com",
    password: "demo1234",
    bio: "Backend-heavy generalist. GraphQL, Postgres, and the messy middle of product APIs.",
    avatar: "JL",
    location: "Austin, US",
    github: "jordanlee",
    skills: ["GraphQL", "PostgreSQL", "Node.js", "Rust"],
    createdAt: daysAgo(45),
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Pulseboard",
    slug: "pulseboard",
    description:
      "A lightweight status wall for distributed teams — async updates without Slack noise.",
    longDescription:
      "Pulseboard lets teams post short standups, blockers, and wins in a shared timeline. Built for async-first orgs that want signal without another chat app. Includes reactions, weekly digests, and Slack webhook export.",
    tags: ["React", "TypeScript", "Productivity"],
    status: "building",
    repoUrl: "https://github.com/example/pulseboard",
    liveUrl: "https://pulseboard.demo",
    ownerId: "u1",
    lookingFor: ["UI/UX", "DevOps"],
    likes: ["u2", "u3"],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
  },
  {
    id: "p2",
    title: "VectorNest",
    slug: "vectornest",
    description:
      "Self-hostable RAG toolkit with pluggable embeddings and a clean TypeScript SDK.",
    longDescription:
      "VectorNest is an open-source RAG stack: document ingest, chunking, hybrid search, and a thin SDK for chat UIs. Designed for teams that want ownership of their retrieval layer without rebuilding infra every sprint.",
    tags: ["Python", "AI/ML", "TypeScript"],
    status: "seeking",
    repoUrl: "https://github.com/example/vectornest",
    ownerId: "u2",
    lookingFor: ["React", "DevOps", "UI/UX"],
    likes: ["u1", "u4"],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(3),
  },
  {
    id: "p3",
    title: "Frameflow",
    slug: "frameflow",
    description:
      "Motion-first component kit for product marketing sites — tokens, presets, and copy-paste.",
    longDescription:
      "Frameflow packages intentional motion patterns (hero reveals, scroll sections, CTAs) as reusable React components. Less template soup, more craft. Includes Storybook docs and theme tokens.",
    tags: ["React", "UI/UX", "Design"],
    status: "shipped",
    liveUrl: "https://frameflow.demo",
    repoUrl: "https://github.com/example/frameflow",
    ownerId: "u3",
    lookingFor: [],
    likes: ["u1", "u2", "u4"],
    createdAt: daysAgo(40),
    updatedAt: daysAgo(8),
  },
  {
    id: "p4",
    title: "SchemaForge",
    slug: "schemaforge",
    description:
      "Collaborative GraphQL schema editor with live validation and migration hints.",
    longDescription:
      "SchemaForge helps API teams evolve GraphQL schemas together: branch-like drafts, conflict highlights, and suggestions when breaking changes sneak in. Pairs with codegen workflows.",
    tags: ["GraphQL", "Node.js", "Developer Tools"],
    status: "idea",
    ownerId: "u4",
    lookingFor: ["React", "TypeScript", "UI/UX"],
    likes: ["u1"],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: "p5",
    title: "Harbor CLI",
    slug: "harbor-cli",
    description:
      "One CLI to scaffold, lint, and ship Vite apps with opinionated defaults.",
    longDescription:
      "Harbor CLI wraps project scaffolding, env checks, and deploy recipes for Vite + React apps. Aimed at students and indie hackers who want production hygiene without a week of config.",
    tags: ["TypeScript", "DevOps", "CLI"],
    status: "building",
    repoUrl: "https://github.com/example/harbor-cli",
    ownerId: "u1",
    lookingFor: ["Rust", "Go"],
    likes: ["u3"],
    createdAt: daysAgo(9),
    updatedAt: daysAgo(0),
  },
];

export const SEED_CONNECTIONS: Connection[] = [
  {
    id: "c1",
    fromId: "u2",
    toId: "u1",
    status: "accepted",
    message: "Loved Pulseboard — happy to help with infra.",
    createdAt: daysAgo(10),
  },
  {
    id: "c2",
    fromId: "u3",
    toId: "u2",
    status: "pending",
    message: "Interested in VectorNest UI — can I jump in?",
    createdAt: daysAgo(2),
  },
];
