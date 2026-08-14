import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useAuth } from "@/context/AuthContext";
import { useData, type ProjectInput } from "@/context/DataContext";
import { resetDemoData } from "@/lib/storage";
import type { ProjectStatus, Skill } from "@/types";

const SKILLS: Skill[] = [
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

const emptyProject: ProjectInput = {
  title: "",
  description: "",
  longDescription: "",
  tags: [],
  status: "idea",
  repoUrl: "",
  liveUrl: "",
  lookingFor: [],
};

export function DashboardPage() {
  const { user, updateProfile, refreshUsers } = useAuth();
  const { projects, createProject, refresh } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [tagInput, setTagInput] = useState("");
  const [lookingInput, setLookingInput] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    skills: [] as Skill[],
  });

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website || "",
      github: user.github || "",
      skills: user.skills,
    });
  }, [user]);

  const mine = useMemo(
    () => projects.filter((p) => p.ownerId === user?.id),
    [projects, user]
  );

  if (!user) return <Navigate to="/auth" replace />;

  const submitProject = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and short description are required");
      return;
    }
    const created = createProject({
      ...form,
      tags: form.tags.length ? form.tags : tagInput ? [tagInput] : ["General"],
      lookingFor: form.lookingFor,
    });
    if (created) {
      toast.success("Project published");
      setOpen(false);
      setForm(emptyProject);
      setTagInput("");
      setLookingInput("");
      navigate(`/projects/${created.slug}`);
    }
  };

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name.trim(),
      bio: profileForm.bio.trim(),
      location: profileForm.location.trim(),
      website: profileForm.website.trim() || undefined,
      github: profileForm.github.trim() || undefined,
      skills: profileForm.skills,
      avatar: profileForm.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile and projects, {user.name.split(" ")[0]}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetDemoData();
              refresh();
              refreshUsers();
              toast.message("Demo data reset");
            }}
          >
            <RefreshCw className="h-4 w-4" /> Reset demo data
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="mt-8">
        <TabsList>
          <TabsTrigger value="projects">My projects</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          {mine.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="text-muted-foreground">You haven&apos;t published anything yet.</p>
              <Button className="mt-4" onClick={() => setOpen(true)}>
                Create your first project
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <form
            onSubmit={saveProfile}
            className="max-w-xl space-y-4 rounded-xl border bg-card p-6"
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profileForm.location}
                onChange={(e) => setProfileForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={profileForm.website}
                  onChange={(e) => setProfileForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub username</Label>
                <Input
                  value={profileForm.github}
                  onChange={(e) => setProfileForm((f) => ({ ...f, github: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => {
                  const on = profileForm.skills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setProfileForm((f) => ({
                          ...f,
                          skills: on ? f.skills.filter((x) => x !== s) : [...f.skills, s],
                        }))
                      }
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save profile</Button>
              <Button type="button" variant="outline" asChild>
                <Link to={`/u/${user.username}`}>View public profile</Link>
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Publish a project</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitProject}>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Short description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Full description</Label>
              <Textarea
                value={form.longDescription}
                onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                rows={4}
                placeholder="What you're building, stack, and what help looks like…"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProjectStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="building">Building</SelectItem>
                  <SelectItem value="seeking">Seeking help</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setForm((f) => ({
                    ...f,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }));
                }}
                placeholder="React, TypeScript, AI"
              />
            </div>
            <div className="space-y-2">
              <Label>Looking for (comma-separated)</Label>
              <Input
                value={lookingInput}
                onChange={(e) => {
                  setLookingInput(e.target.value);
                  setForm((f) => ({
                    ...f,
                    lookingFor: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }));
                }}
                placeholder="UI/UX, DevOps"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Repo URL</Label>
                <Input
                  value={form.repoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  value={form.liveUrl}
                  onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Publish</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
