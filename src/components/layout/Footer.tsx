import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display font-semibold">Code Connect Hub</p>
            <p className="text-sm text-muted-foreground">Find collaborators. Ship together.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/explore" className="hover:text-foreground">
            Explore
          </Link>
          <Link to="/developers" className="hover:text-foreground">
            Developers
          </Link>
          <Link to="/auth" className="hover:text-foreground">
            Join
          </Link>
        </div>
      </div>
    </footer>
  );
}
