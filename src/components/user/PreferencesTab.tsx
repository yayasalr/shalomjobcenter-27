
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const PreferencesTab: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  
  const savePreferences = () => {
    toast.success("Préférences enregistrées avec succès");
  };

  const toggleDarkMode = (checked: boolean) => {
    updateSettings({ darkMode: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>Personnalisez votre expérience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications par email</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications sur les réservations</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications push</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications sur votre navigateur</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mode sombre</h3>
              <p className="text-sm text-gray-500">Utiliser le thème sombre pour l'interface</p>
            </div>
            <Switch 
              checked={settings.darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Langue</h3>
              <p className="text-sm text-gray-500">Choisir la langue de l'interface</p>
            </div>
            <select 
              className="border rounded-md p-1"
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'fr' | 'en' })}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={savePreferences}>
          <Check className="h-4 w-4 mr-2" />
          Enregistrer les préférences
        </Button>
      </CardFooter>
    </Card>
  );
};
