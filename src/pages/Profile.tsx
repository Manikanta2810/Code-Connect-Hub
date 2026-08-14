import { Link, useParams } from "react-router-dom";
import { Github, Globe, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConnectDialogButton } from "@/components/developers/DeveloperCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

export function ProfilePage() {
  const { username } = useParams();
  const { getUserByUsername, user } = useAuth();
  const { projects, connections } = useData();
  const profile = username ? getUserByUsername(username) : undefined;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">User not found</h1>
        <Button className="mt-6" asChild>
          <Link to="/developers">Browse developers</Link>
        </Button>
      </div>
    );
  }

  const owned = projects.filter((p) => p.ownerId === profile.id);
  const isSelf = user?.id === profile.id;
  const connected = user
    ? connections.some(
        (c) =>
          c.status === "accepted" &&
          ((c.fromId === user.id && c.toId === profile.id) ||
            (c.toId === user.id && c.fromId === profile.id))
      )
    : false;
  const pending = user
    ? connections.some(
        (c) =>
          c.status === "pending" &&
          ((c.fromId === user.id && c.toId === profile.id) ||
            (c.toId === user.id && c.fromId === profile.id))
      )
    : false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/15 text-2xl text-primary">
                {profile.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.location && (
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" /> Website
                  </a>
                )}
                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" /> @{profile.github}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            {isSelf ? (
              <Button asChild>
                <Link to="/dashboard">Edit on dashboard</Link>
              </Button>
            ) : !user ? (
              <Button asChild>
                <Link to="/auth">Sign in to connect</Link>
              </Button>
            ) : connected ? (
              <Button variant="secondary" asChild>
                <Link to="/connections">Connected — open chat</Link>
              </Button>
            ) : pending ? (
              <Button variant="outline" disabled>
                Request pending
              </Button>
            ) : (
              <ConnectDialogButton toId={profile.id} toName={profile.name} />
            )}
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-muted-foreground">{profile.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold">Projects</h2>
      {owned.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {owned.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
