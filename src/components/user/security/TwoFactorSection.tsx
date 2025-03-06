
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';
import { User } from '@/hooks/auth/types';

interface TwoFactorSectionProps {
  user: User | null;
}

export const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ user }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    if (showTwoFactorSetup) {
      const key = generateRandomKey();
      setSecretKey(key);
    }
  }, [showTwoFactorSetup]);

  const generateRandomKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const toggleTwoFactor = (enabled: boolean) => {
    if (enabled) {
      setShowTwoFactorSetup(true);
    } else {
      setTwoFactorEnabled(false);
      setShowTwoFactorSetup(false);
      toast.success("Authentification à deux facteurs désactivée");
    }
  };
  
  const setupTwoFactor = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      toast.success("Authentification à deux facteurs activée avec succès");
      
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push({
        type: '2fa_enabled',
        userId: user?.id,
        email: user?.email,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    } else {
      toast.error("Veuillez entrer un code de vérification valide à 6 chiffres");
    }
  };

  const getTotpUrl = () => {
    const issuer = encodeURIComponent('MonApplication');
    const account = encodeURIComponent(user?.email || 'user');
    return `otpauth://totp/${issuer}:${account}?secret=${secretKey}&issuer=${issuer}`;
  };

  const generateRecoveryCodes = () => {
    const codes = Array(10).fill(0).map(() => {
      const code1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${code1}-${code2}`;
    });
    
    localStorage.setItem(`recovery_codes_${user?.id}`, JSON.stringify(codes));
    toast.success("Codes de récupération générés avec succès");
    
    alert("Voici vos codes de récupération. Conservez-les en lieu sûr:\n\n" + codes.join("\n"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-gray-500" />
          Authentification à deux facteurs
        </CardTitle>
        <CardDescription>Renforcez la sécurité de votre compte avec l'authentification à deux facteurs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Activer l'authentification à deux facteurs</div>
            <p className="text-sm text-muted-foreground">Recevez un code unique sur votre téléphone à chaque connexion</p>
          </div>
          <Switch 
            checked={twoFactorEnabled} 
            onCheckedChange={toggleTwoFactor} 
            aria-label="Activer l'authentification à deux facteurs"
          />
        </div>
        
        {showTwoFactorSetup && (
          <div className="mt-6 space-y-4">
            <Separator className="my-4" />
            
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-center mb-2 font-medium">Scanner ce QR code</div>
                <div className="w-40 h-40 bg-white mx-auto flex items-center justify-center">
                  <QRCodeCanvas value={getTotpUrl()} size={140} />
                </div>
                <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                  Utilisez une application comme Google Authenticator
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input 
                id="verification-code" 
                placeholder="Entrez le code à 6 chiffres" 
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTwoFactorSetup(false)}>Annuler</Button>
              <Button onClick={setupTwoFactor}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Valider
              </Button>
            </div>
          </div>
        )}
        
        {twoFactorEnabled && (
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="text-sm font-medium">Codes de récupération</div>
            <p className="text-sm text-muted-foreground mt-1">
              Ces codes vous permettent de vous connecter en cas de perte d'accès à votre téléphone.
            </p>
            <Button variant="outline" className="mt-2" onClick={generateRecoveryCodes}>
              <KeyRound className="h-4 w-4 mr-2" />
              Générer des codes de récupération
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
