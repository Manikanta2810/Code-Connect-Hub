import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeveloperCard } from "@/components/developers/DeveloperCard";
import { useAuth } from "@/context/AuthContext";
import type { Skill } from "@/types";

const ALL_SKILLS: Skill[] = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "UI/UX",
  "DevOps",
  "AI/ML",
  "Mobile",
  "GraphQL",
  "PostgreSQL",
];

export function DevelopersPage() {
  const { users } = useAuth();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState<Skill | "all">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return users.filter((u) => {
      const skillOk = skill === "all" || u.skills.includes(skill);
      if (!skillOk) return false;
      if (!query) return true;
      return (
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.bio.toLowerCase().includes(query) ||
        u.location.toLowerCase().includes(query) ||
        u.skills.some((s) => s.toLowerCase().includes(query))
      );
    });
  }, [users, q, skill]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Developers</h1>
      <p className="mt-2 text-muted-foreground">
        Find builders by skill and reach out when their work matches yours.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, bio, location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={skill} onValueChange={(v) => setSkill(v as Skill | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {ALL_SKILLS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} developer{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <DeveloperCard key={d.id} developer={d} />
        ))}
      </div>
    </div>
  );
}
