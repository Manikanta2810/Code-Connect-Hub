import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

export function AuthPage() {
  const [params] = useSearchParams();
  const initial = params.get("mode") === "signup" ? "signup" : "login";
  const [tab, setTab] = useState(initial);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "aisha@example.com", password: "demo1234" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const demoHint = useMemo(
    () => "Try demo: aisha@example.com / demo1234 (also marcus, sofia, jordan)",
    []
  );

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    const res = login(loginForm.email, loginForm.password);
    if (!res.ok) {
      setError(res.error || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  const onSignup = (e: FormEvent) => {
    e.preventDefault();
    const res = signup(signupForm);
    if (!res.ok) {
      setError(res.error || "Signup failed");
      return;
    }
    toast.success("Account created — you’re in!");
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 mesh-light dark:mesh-dark" />
      <div className="relative mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome</h1>
          <p className="mt-2 text-sm text-muted-foreground">{demoHint}</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v);
              setError("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form className="space-y-4" onSubmit={onLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </div>
                {error && tab === "login" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full">
                  Log in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form className="space-y-4" onSubmit={onSignup}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    required
                    value={signupForm.username}
                    onChange={(e) => setSignupForm((f) => ({ ...f, username: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </div>
                {error && tab === "signup" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Data stays in your browser for this demo.{" "}
          <Link to="/explore" className="text-primary hover:underline">
            Browse without an account
          </Link>
        </p>
      </div>
    </div>
  );
}
