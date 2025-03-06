
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock, ShieldCheck, KeyRound, Smartphone, AlertTriangle, History } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import useAuth from '@/hooks/useAuth';
import QRCode from 'qrcode.react';

export const SecurityTab: React.FC = () => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [secretKey, setSecretKey] = useState('');

  // Generate unique secret key for 2FA when needed
  useEffect(() => {
    if (showTwoFactorSetup) {
      // Create a simple random key for demo purposes
      const key = generateRandomKey();
      setSecretKey(key);
    }
  }, [showTwoFactorSetup]);

  // Generate random key for demo purposes
  const generateRandomKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Récupération de l'historique des connexions
  const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]')
    .filter((log: any) => log.email === user?.email)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

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

    // En production, cette logique serait gérée côté serveur
    // Ici, nous simulons simplement un changement de mot de passe
    // Dans une implémentation réelle, il y aurait une vérification du mot de passe actuel
    
    setTimeout(() => {
      toast.success("Mot de passe mis à jour avec succès");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      setPasswordErrors([]);
      
      // Journaliser le changement de mot de passe
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
      
      // Journaliser l'activation de la 2FA
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
    
    // Ouvrir une fenêtre modale ou afficher les codes
    alert("Voici vos codes de récupération. Conservez-les en lieu sûr:\n\n" + codes.join("\n"));
  };

  return (
    <div className="space-y-6">
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
                    <QRCode value={getTotpUrl()} size={140} />
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
            Appareils connectés
          </CardTitle>
          <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Smartphone className="h-6 w-6 text-gray-400" />
              <div className="flex-1">
                <div className="font-medium">Cet appareil</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {navigator.userAgent.indexOf('iPhone') > -1 ? 'iPhone' : 
                   navigator.userAgent.indexOf('Android') > -1 ? 'Android' : 
                   'Ordinateur'} • Connecté maintenant
                </div>
              </div>
              <Button variant="outline" size="sm">Déconnecter</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-gray-500" />
            Historique de connexion
          </CardTitle>
          <CardDescription>Vérifiez les dernières connexions à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          {loginLogs.length > 0 ? (
            <div className="space-y-4">
              {loginLogs.map((log: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  {log.action === 'logout' ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <KeyRound className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">
                      {log.action === 'logout' ? 'Déconnexion' : 'Connexion réussie'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString('fr-FR')} • 
                      {log.device?.indexOf('iPhone') > -1 ? ' iPhone' : 
                       log.device?.indexOf('Android') > -1 ? ' Android' : 
                       ' Ordinateur'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucun historique de connexion disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

