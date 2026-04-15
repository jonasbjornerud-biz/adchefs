import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthGuard } from "@/components/playbook/AuthGuard";

// Pages
import Login from "./pages/editor/Login";
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Editor */}
            <Route path="/playbook" element={<AuthGuard><Playbook /></AuthGuard>} />

            {/* Admin */}
            <Route path="/admin" element={<AuthGuard requireAdmin><AdminDashboard /></AuthGuard>} />
            <Route path="/admin/clients/new" element={<AuthGuard requireAdmin><ClientForm /></AuthGuard>} />
            <Route path="/admin/clients/:clientId" element={<AuthGuard requireAdmin><ClientDetail /></AuthGuard>} />
            <Route path="/admin/clients/:clientId/playbook" element={<AuthGuard requireAdmin><PlaybookBuilder /></AuthGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
