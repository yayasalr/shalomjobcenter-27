
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export const SecurityTab: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const updatePassword = () => {
    toast.success("Mot de passe mis à jour avec succès");
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
    } else {
      toast.error("Veuillez entrer un code de vérification valide à 6 chiffres");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Modifiez votre mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input id="confirm-password" type="password" />
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
          <CardTitle>Authentification à deux facteurs</CardTitle>
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
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-center mb-2 font-medium">Scanner ce QR code</div>
                  <div className="w-40 h-40 bg-gray-300 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-16 h-16 text-gray-500" />
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-500">
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
                  onChange={(e) => setVerificationCode(e.target.value)}
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
              <Button variant="outline" className="mt-2">
                <KeyRound className="h-4 w-4 mr-2" />
                Générer des codes de récupération
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appareils connectés</CardTitle>
          <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Smartphone className="h-6 w-6 text-gray-400" />
              <div className="flex-1">
                <div className="font-medium">iPhone 13 Pro</div>
                <div className="text-sm text-gray-500">Paris, France • Dernière connexion il y a 10 minutes</div>
              </div>
              <Button variant="outline" size="sm">Déconnecter</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-4">
              <Smartphone className="h-6 w-6 text-gray-400" />
              <div className="flex-1">
                <div className="font-medium">Samsung Galaxy S22</div>
                <div className="text-sm text-gray-500">Lomé, Togo • Dernière connexion il y a 3 jours</div>
              </div>
              <Button variant="outline" size="sm">Déconnecter</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
