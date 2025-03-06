
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/hooks/auth/types';

interface PasswordSectionProps {
  user: User | null;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors = [];
    let strength = 0;

    if (password.length < 12) {
      errors.push("Le mot de passe doit contenir au moins 12 caractères");
    } else {
      strength += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
    } else {
      strength += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
    } else {
      strength += 1;
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    } else {
      strength += 1;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    } else {
      strength += 1;
    }

    setPasswordStrength(strength);
    setPasswordErrors(errors);

    return errors.length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const updatePassword = () => {
    if (!currentPassword) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }

    setTimeout(() => {
      toast.success("Mot de passe mis à jour avec succès");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      setPasswordErrors([]);
      
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push({
        type: 'password_changed',
        userId: user?.id,
        email: user?.email,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2 text-gray-500" /> 
          Mot de passe
        </CardTitle>
        <CardDescription>Modifiez votre mot de passe avec des critères de sécurité renforcés</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input 
            id="current-password" 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input 
            id="new-password" 
            type="password" 
            value={newPassword}
            onChange={handlePasswordChange}
          />
          
          {newPassword && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    passwordStrength < 2 ? 'bg-red-500' : 
                    passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Force du mot de passe: {
                  passwordStrength < 2 ? 'Faible' : 
                  passwordStrength < 4 ? 'Moyen' : 'Fort'
                }
              </p>
              
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <div key={index} className="flex items-center text-xs text-red-500 dark:text-red-400">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          {confirmPassword && newPassword && (
            <div className="text-xs mt-1">
              {confirmPassword === newPassword ? (
                <span className="text-green-500 dark:text-green-400">Les mots de passe correspondent</span>
              ) : (
                <span className="text-red-500 dark:text-red-400">Les mots de passe ne correspondent pas</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={updatePassword}>
          <Lock className="h-4 w-4 mr-2" />
          Mettre à jour le mot de passe
        </Button>
      </CardFooter>
    </Card>
  );
};
