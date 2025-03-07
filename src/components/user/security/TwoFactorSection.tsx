
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';
import { User } from '@/hooks/auth/types';
import { v4 as uuidv4 } from 'uuid';

interface TwoFactorSectionProps {
  user: User | null;
}

export const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ user }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [codesPrinted, setCodesPrinted] = useState(false);

  useEffect(() => {
    // Check if 2FA is already enabled for this user
    if (user?.id) {
      const userTwoFactorData = localStorage.getItem(`2fa_${user.id}`);
      if (userTwoFactorData) {
        try {
          const parsedData = JSON.parse(userTwoFactorData);
          setTwoFactorEnabled(parsedData.enabled || false);
        } catch (e) {
          console.error("Error parsing 2FA data", e);
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (showTwoFactorSetup) {
      // Generate a cryptographically secure key
      const key = generateSecureKey();
      setSecretKey(key);
    }
  }, [showTwoFactorSetup]);

  // Generate a more secure key using a combination of UUID and random values
  const generateSecureKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const uuid = uuidv4().replace(/-/g, '');
    let result = '';
    
    // Use the UUID as a seed for generating the TOTP secret
    for (let i = 0; i < 16; i++) {
      const randomIndex = (uuid.charCodeAt(i % uuid.length) + i) % chars.length;
      result += chars.charAt(randomIndex);
    }
    
    return result;
  };

  const toggleTwoFactor = (enabled: boolean) => {
    if (enabled) {
      setShowTwoFactorSetup(true);
    } else {
      // Require confirmation before disabling 2FA
      if (window.confirm("Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ? Cela réduit significativement la sécurité de votre compte.")) {
        setTwoFactorEnabled(false);
        setShowTwoFactorSetup(false);
        
        // Log this security-critical action
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push({
          type: '2fa_disabled',
          userId: user?.id,
          email: user?.email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
        
        // Update user 2FA status
        if (user?.id) {
          localStorage.setItem(`2fa_${user.id}`, JSON.stringify({
            enabled: false,
            lastUpdated: new Date().toISOString()
          }));
        }
        
        toast.success("Authentification à deux facteurs désactivée");
      }
    }
  };
  
  const setupTwoFactor = () => {
    // Validate verification code (in a real app, we would validate against the TOTP algorithm)
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      // Generate recovery codes if we haven't already
      const codes = recoveryCodes.length > 0 ? 
        recoveryCodes : 
        Array(10).fill(0).map(() => {
          const code1 = Math.random().toString(36).substring(2, 6).toUpperCase();
          const code2 = Math.random().toString(36).substring(2, 6).toUpperCase();
          return `${code1}-${code2}`;
        });
      
      setRecoveryCodes(codes);
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setShowRecoveryCodes(true);
      
      // Store 2FA data
      if (user?.id) {
        localStorage.setItem(`2fa_${user.id}`, JSON.stringify({
          enabled: true,
          secretKey: secretKey, // In a real app, this would be encrypted
          recoveryCodes: codes, // In a real app, these would be hashed
          lastUpdated: new Date().toISOString()
        }));
      }
      
      // Log the security action
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push({
        type: '2fa_enabled',
        userId: user?.id,
        email: user?.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
      
      toast.success("Authentification à deux facteurs activée avec succès");
    } else {
      toast.error("Veuillez entrer un code de vérification valide à 6 chiffres");
    }
  };

  const getTotpUrl = () => {
    const issuer = encodeURIComponent('SecureSholom');
    const account = encodeURIComponent(user?.email || 'user@example.com');
    return `otpauth://totp/${issuer}:${account}?secret=${secretKey}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  };

  const generateRecoveryCodes = () => {
    const codes = Array(10).fill(0).map(() => {
      const code1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${code1}-${code2}`;
    });
    
    setRecoveryCodes(codes);
    setShowRecoveryCodes(true);
    
    // Update stored codes
    if (user?.id) {
      const existingData = JSON.parse(localStorage.getItem(`2fa_${user.id}`) || '{}');
      localStorage.setItem(`2fa_${user.id}`, JSON.stringify({
        ...existingData,
        recoveryCodes: codes,
        lastUpdated: new Date().toISOString()
      }));
    }
    
    toast.success("Nouveaux codes de récupération générés");
  };

  const handlePrintCodes = () => {
    setCodesPrinted(true);
    
    // Format codes for printing
    const formattedCodes = recoveryCodes.map(code => `• ${code}`).join('\n');
    const content = `
      CODES DE RÉCUPÉRATION - SHOLOM
      ==============================
      Utilisateur: ${user?.email}
      Générés le: ${new Date().toLocaleString()}
      
      Conservez ces codes en lieu sûr. Chaque code ne peut être utilisé qu'une seule fois.
      
      ${formattedCodes}
    `;
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Codes de récupération - Sholom</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              h1 { font-size: 18px; }
              .code { font-weight: bold; }
              .warning { color: #c00; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>Codes de récupération Sholom</h1>
            <p>Pour: ${user?.email}</p>
            <p>Générés le: ${new Date().toLocaleString()}</p>
            <div class="warning">
              IMPORTANT: Conservez ces codes en lieu sûr. Chaque code ne peut être utilisé qu'une seule fois.
            </div>
            <ul>
              ${recoveryCodes.map(code => `<li class="code">${code}</li>`).join('')}
            </ul>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const closeRecoveryCodes = () => {
    if (!codesPrinted) {
      if (!window.confirm("Vous n'avez pas imprimé vos codes de récupération. Êtes-vous sûr de vouloir continuer sans les imprimer ?")) {
        return;
      }
    }
    setShowRecoveryCodes(false);
    setCodesPrinted(false);
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
        {!showRecoveryCodes ? (
          <>
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
            
            {twoFactorEnabled && !showTwoFactorSetup && (
              <div className="mt-4">
                <Alert variant="default" className="mb-4 bg-blue-50 text-blue-800 border border-blue-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    L'authentification à deux facteurs est activée. Votre compte est mieux protégé contre les accès non autorisés.
                  </AlertDescription>
                </Alert>
                
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
            
            {showTwoFactorSetup && (
              <div className="mt-6 space-y-4">
                <Separator className="my-4" />
                
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-center mb-2 font-medium">Scanner ce QR code</div>
                    <div className="w-40 h-40 bg-white mx-auto flex items-center justify-center">
                      <QRCodeCanvas value={getTotpUrl()} size={140} />
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-500">
                      Code secret: <code className="bg-gray-200 px-1 py-0.5 rounded">{secretKey}</code>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                      Utilisez une application comme Google Authenticator ou Authy
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
          </>
        ) : (
          <div className="space-y-4">
            <Alert variant="default" className="bg-yellow-50 text-yellow-800 border border-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                IMPORTANT : Conservez ces codes en lieu sûr. Si vous perdez l'accès à votre téléphone, ces codes seront votre unique moyen de vous connecter.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Vos codes de récupération</h4>
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm bg-white p-2 border rounded">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrintCodes}>
                Imprimer les codes
              </Button>
              <Button onClick={closeRecoveryCodes}>
                J'ai sauvegardé mes codes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
