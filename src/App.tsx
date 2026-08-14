import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingPage } from "@/pages/Landing";
import { ExplorePage } from "@/pages/Explore";
import { DevelopersPage } from "@/pages/Developers";
import { AuthPage } from "@/pages/Auth";
import { ProjectDetailPage } from "@/pages/ProjectDetail";
import { ProfilePage } from "@/pages/Profile";
import { DashboardPage } from "@/pages/Dashboard";
import { ConnectionsPage } from "@/pages/Connections";
import { NotFoundPage } from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="developers" element={<DevelopersPage />} />
                <Route path="projects/:slug" element={<ProjectDetailPage />} />
                <Route path="u/:username" element={<ProfilePage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="connections" element={<ConnectionsPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster richColors position="top-right" />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
