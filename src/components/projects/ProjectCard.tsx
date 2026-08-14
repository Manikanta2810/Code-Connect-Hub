import { Link } from "react-router-dom";
import { ExternalLink, GitBranch, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { cn, formatRelative } from "@/lib/utils";
import type { Project } from "@/types";

const statusLabel: Record<Project["status"], string> = {
  idea: "Idea",
  building: "Building",
  shipped: "Shipped",
  seeking: "Seeking help",
};

const statusColor: Record<Project["status"], string> = {
  idea: "bg-secondary text-secondary-foreground",
  building: "bg-primary/15 text-primary",
  shipped: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  seeking: "bg-accent/20 text-accent-foreground",
};

export function ProjectCard({ project }: { project: Project }) {
  const { getUserById, user } = useAuth();
  const { toggleLike } = useData();
  const owner = getUserById(project.ownerId);
  const liked = user ? project.likes.includes(user.id) : false;

  return (
    <article className="group flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/projects/${project.slug}`}
            className="font-display text-xl font-semibold tracking-tight hover:text-primary"
          >
            {project.title}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            by{" "}
            {owner ? (
              <Link to={`/u/${owner.username}`} className="hover:text-foreground">
                @{owner.username}
              </Link>
            ) : (
              "unknown"
            )}{" "}
            · {formatRelative(project.updatedAt)}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
            statusColor[project.status]
          )}
        >
          {statusLabel[project.status]}
        </span>
      </div>

      <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">{project.description}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {project.lookingFor.length > 0 && (
        <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Looking for: {project.lookingFor.join(", ")}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2", liked && "text-rose-500")}
            onClick={() => toggleLike(project.id)}
            disabled={!user}
            title={user ? "Like" : "Sign in to like"}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            {project.likes.length}
          </Button>
          {project.repoUrl && (
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                <GitBranch className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/projects/${project.slug}`}>View</Link>
        </Button>
      </div>
    </article>
  );
}
