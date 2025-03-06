
import { useState, useEffect } from 'react';
import { Facebook, Twitter, Github, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { SocialAccount } from './types';
import useAuth from '@/hooks/useAuth';

export const useSocialAccounts = () => {
  const { user } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<SocialAccount | null>(null);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);
  
  // Load social accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem(`social_accounts_${user?.id}`);
    if (savedAccounts) {
      setSocialAccounts(JSON.parse(savedAccounts));
    } else {
      // Default accounts if none saved
      const defaultAccounts = [
        { 
          id: 'facebook', 
          name: 'Facebook', 
          icon: Facebook, 
          connected: false, 
          email: null
        },
        { 
          id: 'twitter', 
          name: 'Twitter', 
          icon: Twitter, 
          connected: false, 
          email: null
        },
        { 
          id: 'github', 
          name: 'GitHub', 
          icon: Github, 
          connected: false, 
          email: null
        },
        { 
          id: 'linkedin', 
          name: 'LinkedIn', 
          icon: Linkedin, 
          connected: false, 
          email: null
        },
      ];
      setSocialAccounts(defaultAccounts);
    }
  }, [user?.id]);

  // Save accounts to localStorage when changed
  useEffect(() => {
    if (user?.id && socialAccounts.length > 0) {
      localStorage.setItem(`social_accounts_${user.id}`, JSON.stringify(socialAccounts));
    }
  }, [socialAccounts, user?.id]);

  const handleConnect = (accountId: string) => {
    const account = socialAccounts.find(a => a.id === accountId);
    if (account) {
      setCurrentAccount(account);
      setShowConnectDialog(true);
    }
  };

  const submitConnect = (email: string, password: string) => {
    // Update the account in the state
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === currentAccount?.id) {
        return {
          ...account,
          connected: true,
          email: email
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    setShowConnectDialog(false);
    
    // Log the connection
    logSocialActivity(currentAccount?.id || '', 'connect');
    
    toast.success(`Compte ${currentAccount?.name} connecté avec succès`);
  };

  const initiateDisconnect = (accountId: string) => {
    setAccountToDisconnect(accountId);
    setShowConfirmDisconnect(true);
  };

  const handleDisconnect = () => {
    if (!accountToDisconnect) return;
    
    const updatedAccounts = socialAccounts.map(account => {
      if (account.id === accountToDisconnect) {
        return {
          ...account,
          connected: false,
          email: null
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    setShowConfirmDisconnect(false);
    setAccountToDisconnect(null);
    
    // Log the disconnection
    logSocialActivity(accountToDisconnect, 'disconnect');
    
    toast.success(`Compte déconnecté`);
  };

  const logSocialActivity = (accountId: string, action: 'connect' | 'disconnect') => {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    securityLogs.push({
      type: `social_account_${action}`,
      userId: user?.id,
      email: user?.email,
      accountType: accountId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('security_logs', JSON.stringify(securityLogs));
  };

  return {
    socialAccounts,
    currentAccount,
    showConnectDialog,
    setShowConnectDialog,
    showConfirmDisconnect,
    setShowConfirmDisconnect,
    handleConnect,
    submitConnect,
    initiateDisconnect,
    handleDisconnect,
  };
};
