
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminListings from './pages/admin/AdminListings';
import AdminJobs from './pages/admin/AdminJobs';
import AdminMessages from './pages/admin/AdminMessages';
import Profile from './pages/user/Profile';
import Messages from './pages/user/Messages';
import Reservations from './pages/user/Reservations';
import JobDetail from './pages/JobDetail';
import Jobs from './pages/Jobs';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<Index />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/listings/:id" element={<ListingDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      
      {/* Authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Tableau de bord utilisateur */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/reservations" element={<Reservations />} />
      
      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/listings" element={<AdminListings />} />
      <Route path="/admin/jobs" element={<AdminJobs />} />
      <Route path="/admin/messages" element={<AdminMessages />} />
      
      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
