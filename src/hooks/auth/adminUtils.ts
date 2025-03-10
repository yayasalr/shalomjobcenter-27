
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { logSecurityEvent } from './securityUtils';

// Ensure an admin account exists for demo purposes
export const ensureAdminAccount = () => {
  const existingUser = localStorage.getItem('user_data');
  if (!existingUser) {
    // Create a default admin account if none exists
    const defaultAdmin = {
      id: 'admin-1',
      email: 'SHJob@Center.com',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true,
      securityLevel: 'high',
      created: new Date().toISOString(),
      lastLogin: null,
      passwordLastChanged: new Date().toISOString(),
      requiresPasswordChange: false,
      loginCount: 0
    };
    
    // Generate a browser fingerprint for the admin account
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
    localStorage.setItem(`fingerprint_admin-1`, fingerprint);
    
    // Note: In a real app, you would never store credentials in localStorage like this
    // This is only for demo purposes
    const adminPasswordSalt = uuidv4();
    // Utilisation du mot de passe exact tel qu'affiché dans l'interface utilisateur
    const hashedPassword = CryptoJS.SHA256(`SHJob@Center==12@${adminPasswordSalt}`).toString();
    
    localStorage.setItem('admin_credentials', JSON.stringify({
      email: 'SHJob@Center.com',
      passwordHash: hashedPassword,
      salt: adminPasswordSalt,
      plainPassword: 'SHJob@Center==12@' // Pour la démo uniquement
    }));
    
    // Initialize security logs
    initializeSecurityLogs();
  }
  // Si les identifiants existent déjà, réinitialiser avec le mot de passe correct
  else {
    resetAdminCredentials();
  }
};

// Initialize security logs structure
const initializeSecurityLogs = () => {
  if (!localStorage.getItem('security_logs')) {
    localStorage.setItem('security_logs', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('admin_access_logs')) {
    localStorage.setItem('admin_access_logs', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('suspicious_activities')) {
    localStorage.setItem('suspicious_activities', JSON.stringify([]));
  }
};

// Fonction pour réinitialiser les identifiants de l'administrateur
export const resetAdminCredentials = () => {
  // Créer un nouveau sel mais s'assurer que le mot de passe reste inchangé
  const adminPasswordSalt = uuidv4();
  const plainPassword = 'SHJob@Center==12@';
  const hashedPassword = CryptoJS.SHA256(`${plainPassword}${adminPasswordSalt}`).toString();
  
  localStorage.setItem('admin_credentials', JSON.stringify({
    email: 'SHJob@Center.com',
    passwordHash: hashedPassword,
    salt: adminPasswordSalt,
    plainPassword // Pour la démo uniquement
  }));
  
  console.log("Identifiants admin réinitialisés avec succès:", {
    email: 'SHJob@Center.com',
    plainPassword: plainPassword
  });
  
  return true;
};
