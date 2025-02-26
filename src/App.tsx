
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminJobs from "./pages/admin/AdminJobs";
import { AdminSettings } from "./pages/admin/AdminSettings";
import ListingDetail from "./pages/ListingDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/logements" element={<AdminListings />} />
          <Route path="/admin/utilisateurs" element={<AdminUsers />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/paiements" element={<AdminPayments />} />
          <Route path="/admin/avis" element={<AdminReviews />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/emplois" element={<AdminJobs />} />
          <Route path="/admin/parametres" element={<AdminSettings />} />
          <Route path="/logement/:id" element={<ListingDetail />} />
          <Route path="/emplois" element={<Jobs />} />
          <Route path="/emploi/:id" element={<JobDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
