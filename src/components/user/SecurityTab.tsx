
import React from 'react';
import useAuth from '@/hooks/useAuth';
import { PasswordSection } from './security/PasswordSection';
import { TwoFactorSection } from './security/TwoFactorSection';
import { DevicesSection } from './security/DevicesSection';
import { LoginHistorySection } from './security/LoginHistorySection';

export const SecurityTab: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PasswordSection user={user} />
      <TwoFactorSection user={user} />
      <DevicesSection />
      <LoginHistorySection user={user} />
    </div>
  );
};
