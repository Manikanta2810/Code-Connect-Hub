import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Code2, Handshake, Rocket, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

export function LandingPage() {
  const { user } = useAuth();
  const { projects } = useData();
  const featured = [...projects].sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-light dark:mesh-dark" />
        <div className="absolute inset-0 grid-noise opacity-40 dark:opacity-20" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl"
          >
            Code Connect Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
          >
            Ship side projects with people who actually build.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Publish what you&apos;re building, find collaborators by skill, and turn cold DMs into
            real commits.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
                {user ? "Open dashboard" : "Start building"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">
                <Search className="h-4 w-4" />
                Explore projects
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-14 max-w-3xl overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-2 border-b border-border/70 bg-muted/50 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">hub.connect</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/90 sm:text-sm">
{`const collab = await hub.find({
  skills: ["TypeScript", "UI/UX"],
  status: "seeking",
});

// → Pulseboard · VectorNest · SchemaForge
await collab.connect({ message: "I can help with DX." });`}
            </pre>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Three steps from idea to collaborators — no endless networking theater.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Show your work",
                body: "List projects with stack, status, and who you need — clear signals beat vague bios.",
              },
              {
                icon: Search,
                title: "Discover builders",
                body: "Filter by skill, status, and intent. Browse people who are shipping, not posing.",
              },
              {
                icon: Handshake,
                title: "Connect & ship",
                body: "Send a focused request, accept matches, and keep the thread next to the work.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border/70 bg-background p-6"
              >
                <item.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">Featured projects</h2>
              <p className="mt-2 text-muted-foreground">Live from the hub — like, fork, or join.</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/explore">
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-3xl font-bold">Ready to find your next collaborator?</h2>
            <p className="mt-2 opacity-90">Create a free profile and publish your first project in minutes.</p>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
              <Rocket className="h-4 w-4" />
              {user ? "Go to dashboard" : "Join Code Connect Hub"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
