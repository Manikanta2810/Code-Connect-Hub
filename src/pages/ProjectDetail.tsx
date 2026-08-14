import { Link, useNavigate, useParams } from "react-router-dom";
import { ExternalLink, GitBranch, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { cn, formatRelative } from "@/lib/utils";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { getProjectBySlug, toggleLike, deleteProject } = useData();
  const { getUserById, user } = useAuth();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Project not found</h1>
        <Button className="mt-6" asChild>
          <Link to="/explore">Back to explore</Link>
        </Button>
      </div>
    );
  }

  const owner = getUserById(project.ownerId);
  const liked = user ? project.likes.includes(user.id) : false;
  const isOwner = user?.id === project.ownerId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link to="/explore" className="hover:text-foreground">
          Explore
        </Link>{" "}
        / {project.title}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">{project.title}</h1>
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {project.status}
        </Badge>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {owner && (
          <Link to={`/u/${owner.username}`} className="flex items-center gap-2 hover:opacity-90">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/15 text-primary text-xs">
                {owner.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{owner.name}</p>
              <p className="text-muted-foreground">@{owner.username}</p>
            </div>
          </Link>
        )}
        <span className="text-sm text-muted-foreground">
          Updated {formatRelative(project.updatedAt)}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={cn(liked && "border-rose-400 text-rose-500")}
          disabled={!user}
          onClick={() => {
            if (!user) {
              toast.message("Sign in to like projects");
              return;
            }
            toggleLike(project.id);
          }}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          {project.likes.length} likes
        </Button>
        {project.repoUrl && (
          <Button variant="outline" asChild>
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              <GitBranch className="h-4 w-4" /> Repo
            </a>
          </Button>
        )}
        {project.liveUrl && (
          <Button variant="outline" asChild>
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> Live
            </a>
          </Button>
        )}
        {isOwner && (
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this project?")) {
                deleteProject(project.id);
                toast.success("Project deleted");
                navigate("/dashboard");
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>

      <Separator className="my-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2 className="font-display text-xl font-semibold">About</h2>
        <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{project.longDescription}</p>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold">Stack & tags</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {project.lookingFor.length > 0 && (
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="font-display text-lg font-semibold">Looking for collaborators</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Roles needed: {project.lookingFor.join(", ")}
          </p>
          {owner && user?.id !== owner.id && (
            <Button className="mt-4" asChild>
              <Link to={`/u/${owner.username}`}>Connect with @{owner.username}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
