import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthGuard } from "@/components/AuthGuard";
// TEMPORARY: site-wide geo-block for Norway. Remove this import and the <GeoGate> wrapper below to lift.
import GeoGate from "@/components/GeoGate";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
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
import JobBoard from "./pages/jobs/JobBoard";
import JobDetail from "./pages/jobs/JobDetail";
import SubmitTask from "./pages/jobs/SubmitTask";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SubmitTaskSlugRoute = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/submit-task-")) {
    return <SubmitTask />;
  }

  return <NotFound />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GeoGate>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:slug" element={<JobDetail />} />
            <Route path="/submit-task" element={<SubmitTask />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />

            {/* Client */}
            <Route path="/dashboard" element={<AuthGuard><ClientDashboard /></AuthGuard>} />
            <Route path="/performance" element={<AuthGuard><PerformanceDashboard /></AuthGuard>} />
            <Route path="/ads" element={<AuthGuard><MetaAdsDashboard /></AuthGuard>} />

            {/* Admin */}
            <Route path="/admin" element={<AuthGuard requireAdmin><AdminDashboard /></AuthGuard>} />
            <Route path="/admin/recruitment" element={<AuthGuard requireAdmin><AdminDashboard initialTab="recruitment" /></AuthGuard>} />
            <Route path="/admin/clients/new" element={<AuthGuard requireAdmin><ClientForm /></AuthGuard>} />
            <Route path="/admin/clients/:clientId" element={<AuthGuard requireAdmin><ClientDetail /></AuthGuard>} />

            {/* Mock / Demo */}
            <Route path="/mock" element={<MockClientDashboard />} />
            <Route path="/mock/ads" element={<MockAdsDashboard />} />
            <Route path="/mock/performance" element={<MockPerformanceDashboard />} />

            <Route path="*" element={<SubmitTaskSlugRoute />} />
          </Routes>
          </GeoGate>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
