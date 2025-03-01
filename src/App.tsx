
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { SidebarProvider } from './components/ui/sidebar';
import { AnimatePresence } from 'framer-motion';

import Index from './pages/Index';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';

// User routes
import Profile from './pages/user/Profile';
import Favorites from './pages/user/Favorites';
import UserReservations from './pages/user/Reservations';
import Messages from './pages/user/Messages';
import Notifications from './pages/user/Notifications';

// Admin routes
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminJobs from './pages/admin/AdminJobs';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReservations from './pages/admin/AdminReservations';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

// Import components
import { CompareListings } from './components/CompareListings';
import { useEffect } from 'react';
import { useSiteSettings } from './hooks/useSiteSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { settings, applySettingsToDOM } = useSiteSettings();
  
  // Appliquer les paramètres du site au chargement
  useEffect(() => {
    applySettingsToDOM();
  }, [applySettingsToDOM, settings]);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/logement/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/emplois" element={<Jobs />} />
              <Route path="/emploi/:id" element={<JobDetail />} />
              
              {/* User routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/reservations" element={<UserReservations />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/logements" element={<AdminListings />} />
              <Route path="/admin/emplois" element={<AdminJobs />} />
              <Route path="/admin/avis" element={<AdminReviews />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/paiements" element={<AdminPayments />} />
              <Route path="/admin/utilisateurs" element={<AdminUsers />} />
              <Route path="/admin/support" element={<AdminSupport />} />
              <Route path="/admin/parametres" element={<AdminSettings />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          
          {/* Composant de comparaison qui sera visible sur toutes les pages */}
          <CompareListings />
          
          {/* Toasters pour les notifications */}
          <SonnerToaster position="top-right" closeButton theme="light" 
            toastOptions={{
              classNames: {
                toast: "notification-pop",
                title: "font-semibold",
                description: "text-sm"
              }
            }}
          />
          <Toaster />
        </Router>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
