import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import type { User } from "@/types";

export function DeveloperCard({ developer }: { developer: User }) {
  const { projects } = useData();
  const count = projects.filter((p) => p.ownerId === developer.id).length;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border/80 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/15 text-primary">{developer.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={`/u/${developer.username}`}
            className="font-display text-lg font-semibold hover:text-primary"
          >
            {developer.name}
          </Link>
          <p className="text-sm text-muted-foreground">@{developer.username}</p>
        </div>
      </div>
      <p className="mb-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{developer.bio}</p>
      {developer.location && (
        <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {developer.location}
        </p>
      )}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {developer.skills.slice(0, 4).map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {count} project{count === 1 ? "" : "s"}
        </span>
        <Button size="sm" variant="secondary" asChild>
          <Link to={`/u/${developer.username}`}>Profile</Link>
        </Button>
      </div>
    </article>
  );
}

export function ConnectDialogButton({
  toId,
  toName,
}: {
  toId: string;
  toName: string;
}) {
  const { requestConnection } = useData();
  const [message, setMessage] = useState("Would love to collaborate!");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>Connect with {toName.split(" ")[0]}</Button>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-4 shadow-sm">
      <p className="mb-2 font-medium">Send connection request</p>
      <textarea
        className="mb-2 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
      {done && <p className="mb-2 text-sm text-primary">Request sent!</p>}
      <div className="flex gap-2">
        <Button
          onClick={() => {
            const res = requestConnection(toId, message);
            if (!res.ok) setError(res.error || "Failed");
            else {
              setDone(true);
              setError("");
              setTimeout(() => setOpen(false), 800);
            }
          }}
        >
          Send
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
