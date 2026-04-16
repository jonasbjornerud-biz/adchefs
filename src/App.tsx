import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthGuard } from "@/components/playbook/AuthGuard";

// Pages
import Index from "./pages/Index";
import Login from "./pages/editor/Login";
import ClientDashboard from "./pages/editor/ClientDashboard";
import PerformanceDashboard from "./pages/editor/PerformanceDashboard";
import MetaAdsDashboard from "./pages/editor/MetaAdsDashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ClientDetail from "./pages/admin/ClientDetail";
import ClientForm from "./pages/admin/ClientForm";
import MockClientDashboard from "./pages/mock/MockClientDashboard";
import MockAdsDashboard from "./pages/mock/MockAdsDashboard";
import MockPerformanceDashboard from "./pages/mock/MockPerformanceDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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

            {/* Admin */}
            <Route path="/admin" element={<AuthGuard requireAdmin><AdminDashboard /></AuthGuard>} />
            <Route path="/admin/clients/new" element={<AuthGuard requireAdmin><ClientForm /></AuthGuard>} />
            <Route path="/admin/clients/:clientId" element={<AuthGuard requireAdmin><ClientDetail /></AuthGuard>} />
            {/* Admin previews of client dashboards */}
            <Route path="/admin/clients/:clientId/performance" element={<AuthGuard requireAdmin><PerformanceDashboard /></AuthGuard>} />
            <Route path="/admin/clients/:clientId/ads" element={<AuthGuard requireAdmin><MetaAdsDashboard /></AuthGuard>} />

            {/* Mock / Demo */}
            <Route path="/mock" element={<MockClientDashboard />} />
            <Route path="/mock/ads" element={<MockAdsDashboard />} />
            <Route path="/mock/performance" element={<MockPerformanceDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
