
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PasswordSection } from './security/PasswordSection';
import { TwoFactorSection } from './security/TwoFactorSection';
import { DevicesSection } from './security/DevicesSection';
import { LoginHistorySection } from './security/LoginHistorySection';
import { SecurityScanSection } from './security/SecurityScanSection';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-yellow-50 text-yellow-800 border border-yellow-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          La sécurité de votre compte est importante. Nous vous recommandons d'activer l'authentification à deux facteurs et de vérifier régulièrement les activités de connexion.
        </AlertDescription>
      </Alert>
      
      <SecurityScanSection user={user} />
      <TwoFactorSection user={user} />
      <PasswordSection user={user} />
      <DevicesSection />
      <LoginHistorySection user={user} />
    </div>
  );
};
