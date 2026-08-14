import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { formatRelative } from "@/lib/utils";

export function ConnectionsPage() {
  const { user, getUserById } = useAuth();
  const { connections, messages, respondConnection, sendMessage } = useData();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const incoming = useMemo(
    () => (user ? connections.filter((c) => c.toId === user.id && c.status === "pending") : []),
    [connections, user]
  );
  const outgoing = useMemo(
    () => (user ? connections.filter((c) => c.fromId === user.id && c.status === "pending") : []),
    [connections, user]
  );
  const accepted = useMemo(
    () =>
      user
        ? connections.filter(
            (c) =>
              c.status === "accepted" && (c.fromId === user.id || c.toId === user.id)
          )
        : [],
    [connections, user]
  );

  const active = accepted.find((c) => c.id === activeId) || accepted[0];
  const peerId =
    active && user
      ? active.fromId === user.id
        ? active.toId
        : active.fromId
      : null;
  const peer = peerId ? getUserById(peerId) : undefined;

  const thread = useMemo(() => {
    if (!active) return [];
    return messages
      .filter((m) => m.connectionId === active.id)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }, [messages, active]);

  if (!user) return <Navigate to="/auth" replace />;

  const onSend = (e: FormEvent) => {
    e.preventDefault();
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Connections</h1>
      <p className="mt-2 text-muted-foreground">
        Accept requests and keep collaboration chats in one place.
      </p>

      <Tabs defaultValue="inbox" className="mt-8">
        <TabsList>
          <TabsTrigger value="inbox">
            Inbox{incoming.length ? ` (${incoming.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6 space-y-3">
          {incoming.length === 0 ? (
            <Empty text="No pending requests." />
          ) : (
            incoming.map((c) => {
              const from = getUserById(c.fromId);
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/15 text-primary">
                        {from?.avatar || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {from ? (
                          <Link to={`/u/${from.username}`} className="hover:text-primary">
                            {from.name}
                          </Link>
                        ) : (
                          "Unknown"
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRelative(c.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        respondConnection(c.id, true);
                        toast.success("Connected!");
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        respondConnection(c.id, false);
                        toast.message("Request declined");
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6 space-y-3">
          {outgoing.length === 0 ? (
            <Empty text="No outgoing requests." />
          ) : (
            outgoing.map((c) => {
              const to = getUserById(c.toId);
              return (
                <div key={c.id} className="rounded-xl border bg-card p-4">
                  <p className="font-medium">
                    To{" "}
                    {to ? (
                      <Link to={`/u/${to.username}`} className="text-primary hover:underline">
                        @{to.username}
                      </Link>
                    ) : (
                      "unknown"
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Pending · {formatRelative(c.createdAt)}
                  </p>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          {accepted.length === 0 ? (
            <Empty text="Accept a connection to start messaging." />
          ) : (
            <div className="grid min-h-[420px] overflow-hidden rounded-xl border md:grid-cols-[240px_1fr]">
              <aside className="border-b border-border md:border-b-0 md:border-r">
                {accepted.map((c) => {
                  const otherId = c.fromId === user.id ? c.toId : c.fromId;
                  const other = getUserById(otherId);
                  const selected = (activeId || accepted[0]?.id) === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`flex w-full items-center gap-2 border-b px-3 py-3 text-left text-sm hover:bg-muted/60 ${
                        selected ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/15 text-xs text-primary">
                          {other?.avatar || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate font-medium">{other?.name || "Unknown"}</span>
                    </button>
                  );
                })}
              </aside>
              <div className="flex flex-col">
                <div className="border-b px-4 py-3">
                  <p className="font-medium">{peer?.name || "Chat"}</p>
                  {peer && (
                    <Link
                      to={`/u/${peer.username}`}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      @{peer.username}
                    </Link>
                  )}
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {thread.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No messages yet — say hi and propose a first task.
                    </p>
                  )}
                  {thread.map((m) => {
                    const mine = m.senderId === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                            mine
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p>{m.body}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              mine ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatRelative(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={onSend} className="flex gap-2 border-t p-3">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message…"
                  />
                  <Button type="submit" disabled={!draft.trim()}>
                    Send
                  </Button>
                </form>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
      {text}
    </div>
  );
}
