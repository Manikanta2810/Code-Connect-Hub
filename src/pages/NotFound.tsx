import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        That route doesn&apos;t exist in the hub. Try exploring projects instead.
      </p>
      <Button className="mt-6" asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
