
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

import Index from './pages/Index';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';

// Admin routes
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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/logement/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emplois" element={<Jobs />} />
          <Route path="/emploi/:id" element={<JobDetail />} />
          
          {/* Admin routes */}
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
        
        {/* Composant de comparaison qui sera visible sur toutes les pages */}
        <CompareListings />
        
        {/* Toasters pour les notifications */}
        <SonnerToaster position="top-right" closeButton />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
