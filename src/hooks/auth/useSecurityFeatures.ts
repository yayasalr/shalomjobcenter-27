
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import { LocalStorageKeys, SECURITY_CONSTANTS } from "./authUtils";

// Constants for security
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const useSecurityFeatures = (user: User | null) => {
  const navigate = useNavigate();

  // Get login attempts for a specific email
  const getLoginAttempts = (email: string) => {
    const attemptsData = localStorage.getItem(`login_attempts_${email}`);
    if (attemptsData) {
      try {
        return JSON.parse(attemptsData);
      } catch (e) {
        return { count: 0, timestamp: Date.now() };
      }
    }
    return { count: 0, timestamp: Date.now() };
  };

  // Update login attempts for tracking failed logins
  const updateLoginAttempts = (email: string, increment = true) => {
    const attempts = getLoginAttempts(email);
    const now = Date.now();
    
    // If the lockout period has passed, reset the counter
    if (attempts.lockUntil && attempts.lockUntil < now) {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({
        count: increment ? 1 : 0,
        timestamp: now
      }));
      return { count: increment ? 1 : 0, timestamp: now };
    }
    
    // Otherwise, increment the counter
    const newCount = increment ? attempts.count + 1 : 0;
    const newData = { 
      count: newCount, 
      timestamp: now,
      lockUntil: newCount >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_DURATION : undefined
    };
    
    localStorage.setItem(`login_attempts_${email}`, JSON.stringify(newData));
    return newData;
  };

  // Check if an account is locked
  const checkAccountLocked = (email: string) => {
    const attempts = getLoginAttempts(email);
    if (attempts.lockUntil && attempts.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / (60 * 1000));
      return {
        locked: true,
        remainingMinutes: remainingTime
      };
    }
    return { locked: false, remainingMinutes: 0 };
  };

  // Admin functions for security management
  const unlockUserAccount = (email: string) => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    localStorage.removeItem(`login_attempts_${email}`);
    
    // Log the account unlocking
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'account_unlocked',
      adminId: user.id,
      targetEmail: email,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Compte ${email} déverrouillé avec succès`);
    return true;
  };

  const updateUserSecurityLevel = (userId: string, level: 'standard' | 'high' | 'restricted') => {
    if (!user?.isAdmin) {
      toast.error("Seul un administrateur peut effectuer cette action");
      return false;
    }
    
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === userId) {
        return { ...u, securityLevel: level };
      }
      return u;
    });
    
    localStorage.setItem('all_users', JSON.stringify(updatedUsers));
    
    // Log the security level change
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: 'security_level_changed',
      adminId: user.id,
      targetUserId: userId,
      newLevel: level,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    
    toast.success(`Niveau de sécurité mis à jour pour l'utilisateur`);
    return true;
  };

  // Session refresh function with security checks
  const refreshSession = () => {
    console.log("Refreshing user session");
    // In a real application, this would validate JWT tokens, etc.
    
    // Additional security check (example: browser fingerprint)
    if (user) {
      const browserFingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
      const storedFingerprint = localStorage.getItem(`fingerprint_${user.id}`);
      
      if (!storedFingerprint) {
        localStorage.setItem(`fingerprint_${user.id}`, browserFingerprint);
      } else if (storedFingerprint !== browserFingerprint) {
        // Potential suspicious usage detected
        console.warn("Browser fingerprint changed, potential compromised session");
        
        // Log the suspicious attempt
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push({
          type: 'suspicious_session',
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
          expectedFingerprint: storedFingerprint,
          actualFingerprint: browserFingerprint
        });
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
      }
    }
  };

  return {
    refreshSession,
    unlockUserAccount,
    updateUserSecurityLevel,
    checkAccountLocked,
    getLoginAttempts,
    updateLoginAttempts
  };
};
