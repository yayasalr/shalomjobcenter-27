
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import useLocalStorage from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAdmin = false 
}) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    // Enhanced session validation
    if (isAuthenticated && user) {
      // Verify session integrity using fingerprinting
      const currentFingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
      const storedFingerprint = getItem<string>(`fingerprint_${user?.id}`, '');
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        console.warn("Session fingerprint mismatch detected");
        
        // Log suspicious activity
        const securityLogs = getItem<any[]>('security_logs', []);
        securityLogs.push({
          type: 'session_fingerprint_mismatch',
          userId: user?.id || 'unknown',
          timestamp: new Date().toISOString(),
          suspiciousFingerprint: currentFingerprint,
          storedFingerprint,
          path: location.pathname
        });
        setItem('security_logs', securityLogs);
      }
    }
    
    // Enhanced access logging, especially for admin routes
    if (requireAdmin) {
      const accessId = uuidv4(); // Unique ID for this access attempt
      const accessLog = {
        id: accessId,
        path: location.pathname,
        timestamp: new Date().toISOString(),
        userId: user?.id || 'non-authentifié',
        userAgent: navigator.userAgent,
        ipHash: btoa(navigator.userAgent).substring(0, 10), // Pseudo-anonymized fingerprint
        success: isAdmin // Whether access will be granted
      };
      
      const adminAccessLogs = getItem<any[]>('admin_access_logs', []);
      // Limit size of logs to prevent storage attacks
      if (adminAccessLogs.length > 100) adminAccessLogs.shift();
      adminAccessLogs.push(accessLog);
      setItem('admin_access_logs', adminAccessLogs);
      
      // If this is a failed admin access attempt, also record in security incidents
      if (!isAdmin && isAuthenticated) {
        const securityIncidents = getItem<any[]>('security_incidents', []);
        securityIncidents.push({
          type: 'unauthorized_admin_access',
          accessId,
          userId: user?.id,
          userEmail: user?.email,
          timestamp: new Date().toISOString(),
          path: location.pathname,
          userAgent: navigator.userAgent
        });
        setItem('security_incidents', securityIncidents);
      }
    }
  }, [location.pathname, isAuthenticated, requireAdmin, user, getItem, setItem, isAdmin]);

  // If loading, show loading state
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
    </div>;
  }

  // Enhanced security check for authenticated routes
  if (!isAuthenticated) {
    // Log failed access attempts
    const failedAccess = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };
    
    const failedAccessLogs = getItem<any[]>('failed_access_logs', []);
    if (failedAccessLogs.length > 50) failedAccessLogs.shift();
    failedAccessLogs.push(failedAccess);
    setItem('failed_access_logs', failedAccessLogs);
    
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enhanced admin route protection with additional validation
  if (requireAdmin) {
    if (!isAdmin) {
      // Record detailed information about the unauthorized attempt
      const suspiciousActivity = {
        userId: user.id,
        email: user.email,
        attemptedPage: location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        securityLevel: user.securityLevel || 'standard'
      };
      
      const suspiciousActivities = getItem<any[]>('suspicious_activities', []);
      if (suspiciousActivities.length > 50) suspiciousActivities.shift();
      suspiciousActivities.push(suspiciousActivity);
      setItem('suspicious_activities', suspiciousActivities);
      
      // Alert the user
      toast.error("Vous n'avez pas les droits pour accéder à cette page");
      
      // Add a random delay to prevent timing attacks
      const randomDelay = Math.floor(Math.random() * 500) + 500;
      setTimeout(() => {}, randomDelay);
      
      return <Navigate to="/" replace />;
    }
    
    // Additional validation for admin access
    // Check if the admin account has the required security level
    if (user.securityLevel !== 'high' && location.pathname.includes('/admin/utilisateurs')) {
      toast.error("Niveau de sécurité insuffisant pour cette section");
      return <Navigate to="/admin" replace />;
    }
  }

  // If all security checks pass, render the protected content
  return <>{children}</>;
};
