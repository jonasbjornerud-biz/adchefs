import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthGuard } from "@/components/playbook/AuthGuard";

// Pages
import Index from "./pages/Index";
import Login from "./pages/editor/Login";
import ClientDashboard from "./pages/editor/ClientDashboard";
import PerformanceDashboard from "./pages/editor/PerformanceDashboard";
import MetaAdsDashboard from "./pages/editor/MetaAdsDashboard";
import Playbook from "./pages/editor/Playbook";
import AdminDashboard from "./pages/admin/Dashboard";
import ClientDetail from "./pages/admin/ClientDetail";
import ClientForm from "./pages/admin/ClientForm";
import PlaybookBuilder from "./pages/admin/PlaybookBuilder";
import AdminPlaybookView from "./pages/admin/AdminPlaybookView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Client */}
            <Route path="/dashboard" element={<AuthGuard><ClientDashboard /></AuthGuard>} />
            <Route path="/performance" element={<AuthGuard><PerformanceDashboard /></AuthGuard>} />
            <Route path="/ads" element={<AuthGuard><MetaAdsDashboard /></AuthGuard>} />
            <Route path="/playbook" element={<AuthGuard><Playbook /></AuthGuard>} />

            {/* Admin */}
            <Route path="/admin" element={<AuthGuard requireAdmin><AdminDashboard /></AuthGuard>} />
            <Route path="/admin/clients/new" element={<AuthGuard requireAdmin><ClientForm /></AuthGuard>} />
            <Route path="/admin/clients/:clientId" element={<AuthGuard requireAdmin><ClientDetail /></AuthGuard>} />
            <Route path="/admin/clients/:clientId/playbook" element={<AuthGuard requireAdmin><PlaybookBuilder /></AuthGuard>} />
            <Route path="/admin/clients/:clientId/playbook-view" element={<AuthGuard requireAdmin><AdminPlaybookView /></AuthGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
