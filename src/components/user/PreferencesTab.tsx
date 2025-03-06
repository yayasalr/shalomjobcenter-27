import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Sun, BellRing, Bell, Globe, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLanguage } from '@/hooks/useLanguage';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

export const PreferencesTab: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { t, language, setLanguage } = useLanguage();
  const [selectedColor, setSelectedColor] = useState('purple');
  
  const savePreferences = () => {
    toast.success("Préférences enregistrées avec succès");
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'fr' | 'en';
    setLanguage(newLanguage);
    updateSettings({ language: newLanguage });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Dans une application réelle, nous mettrions à jour le thème de couleur ici
    toast.success(`Thème de couleur ${color} appliqué`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="font-medium mb-2">Thème</div>
            <RadioGroup 
              defaultValue="light" 
              className="grid grid-cols-1 gap-4"
              value="light"
              disabled
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="theme-light" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-white p-4 cursor-pointer"
                >
                  <Sun className="mb-2 h-6 w-6 text-yellow-500" />
                  <span>Clair (par défaut)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="font-medium mb-2">Couleur d'accent</div>
            <div className="flex flex-wrap gap-2">
              {['purple', 'blue', 'green', 'orange', 'red', 'teal'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: `var(--${color}-500, ${color})` }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Thème ${color}`}
                />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="font-medium mb-2">Disposition</div>
            <RadioGroup 
              defaultValue="default" 
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="default" 
                  id="layout-default" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="layout-default"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer [&:has([data-state=checked])]:border-primary"
                >
                  <Layout className="mb-2 h-6 w-6" />
                  <span>Standard</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem 
                  value="compact" 
                  id="layout-compact" 
                  className="sr-only" 
                />
                <Label
                  htmlFor="layout-compact"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer [&:has([data-state=checked])]:border-primary"
                >
                  <Layout className="mb-2 h-6 w-6" />
                  <span>Compact</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Gérez vos préférences de notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications par email</div>
                <div className="text-sm text-muted-foreground">Recevoir des mises à jour par email</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications push</div>
                <div className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications de réservation</div>
                <div className="text-sm text-muted-foreground">Mises à jour concernant vos réservations</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications promotionnelles</div>
                <div className="text-sm text-muted-foreground">Offres spéciales et réductions</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Langue et région</CardTitle>
          <CardDescription>Définissez vos préférences linguistiques et régionales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <select 
                  id="language"
                  className="flex-1 border rounded-md px-3 py-2"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <select 
                  id="region"
                  className="flex-1 border rounded-md px-3 py-2"
                >
                  <option value="TG">Togo</option>
                  <option value="FR">France</option>
                  <option value="US">États-Unis</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={savePreferences} className="w-full md:w-auto">
            <Check className="h-4 w-4 mr-2" />
            Enregistrer les préférences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
