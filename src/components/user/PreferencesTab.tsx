import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Sun, Bell, Globe, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/settings';
import { useLanguage } from '@/hooks/language';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import useLocalStorage from '@/hooks/useLocalStorage';

export const PreferencesTab: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { t, language, setLanguage } = useLanguage();
  const { getItem, setItem } = useLocalStorage();
  
  const [selectedColor, setSelectedColor] = useState(() => 
    getItem('user_accent_color', 'purple')
  );
  
  const [selectedLayout, setSelectedLayout] = useState(() => 
    getItem('user_layout', 'default')
  );
  
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    return getItem('user_notification_preferences', {
      email: true,
      push: true,
      reservation: true,
      promotional: false
    });
  });

  useEffect(() => {
    const applyAccentColor = () => {
      const colors: Record<string, string> = {
        'purple': '#8B5CF6',
        'blue': '#3B82F6',
        'green': '#10B981',
        'orange': '#F97316',
        'red': '#EF4444',
        'teal': '#14B8A6'
      };
      
      const colorValue = colors[selectedColor] || colors.purple;
      document.documentElement.style.setProperty('--accent-color', colorValue);
      document.documentElement.style.setProperty('--primary-color', colorValue);
      
      setItem('user_accent_color', selectedColor);
      
      document.querySelectorAll('.btn-primary').forEach(el => {
        (el as HTMLElement).style.backgroundColor = colorValue;
      });
    };
    
    applyAccentColor();
  }, [selectedColor, setItem]);
  
  useEffect(() => {
    const applyLayout = () => {
      const body = document.body;
      
      body.classList.remove('layout-default', 'layout-compact');
      
      body.classList.add(`layout-${selectedLayout}`);
      
      if (selectedLayout === 'compact') {
        document.documentElement.style.setProperty('--content-spacing', '0.75rem');
        document.documentElement.style.setProperty('--card-padding', '1rem');
      } else {
        document.documentElement.style.setProperty('--content-spacing', '1.5rem');
        document.documentElement.style.setProperty('--card-padding', '1.5rem');
      }
      
      setItem('user_layout', selectedLayout);
    };
    
    applyLayout();
  }, [selectedLayout, setItem]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toast.success(`Thème de couleur ${color} appliqué`);
  };
  
  const handleLayoutChange = (value: string) => {
    setSelectedLayout(value);
    toast.success(`Disposition ${value === 'default' ? 'standard' : 'compacte'} appliquée`);
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPrefs(prev => {
      const updated = { ...prev, [key]: value };
      setItem('user_notification_preferences', updated);
      return updated;
    });
  };

  const savePreferences = () => {
    setItem('user_accent_color', selectedColor);
    setItem('user_layout', selectedLayout);
    setItem('user_notification_preferences', notificationPrefs);
    
    updateSettings({ 
      primaryColor: document.documentElement.style.getPropertyValue('--accent-color') || '#8B5CF6'
    });
    
    toast.success("Préférences enregistrées avec succès");
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'fr' | 'en';
    setLanguage(newLanguage);
    updateSettings({ language: newLanguage });
    setItem('user_language', newLanguage);
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
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'purple', color: '#8B5CF6', label: 'Violet' },
                { name: 'blue', color: '#3B82F6', label: 'Bleu' },
                { name: 'green', color: '#10B981', label: 'Vert' },
                { name: 'orange', color: '#F97316', label: 'Orange' }, 
                { name: 'red', color: '#EF4444', label: 'Rouge' },
                { name: 'teal', color: '#14B8A6', label: 'Turquoise' }
              ].map((colorObj) => (
                <button
                  key={colorObj.name}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center transform ${
                    selectedColor === colorObj.name ? 'ring-4 ring-offset-2 ring-black scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorObj.color }}
                  onClick={() => handleColorChange(colorObj.name)}
                  aria-label={`Thème ${colorObj.label}`}
                  title={colorObj.label}
                >
                  {selectedColor === colorObj.name && (
                    <Check className="text-white h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="font-medium mb-2">Disposition</div>
            <RadioGroup 
              value={selectedLayout}
              onValueChange={handleLayoutChange}
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
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${
                    selectedLayout === 'default' ? 'border-primary' : 'border-muted'
                  } bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer`}
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
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${
                    selectedLayout === 'compact' ? 'border-primary' : 'border-muted'
                  } bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer`}
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
              <Switch 
                checked={notificationPrefs.email} 
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications push</div>
                <div className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</div>
              </div>
              <Switch 
                checked={notificationPrefs.push} 
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications de réservation</div>
                <div className="text-sm text-muted-foreground">Mises à jour concernant vos réservations</div>
              </div>
              <Switch 
                checked={notificationPrefs.reservation} 
                onCheckedChange={(checked) => handleNotificationChange('reservation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications promotionnelles</div>
                <div className="text-sm text-muted-foreground">Offres spéciales et réductions</div>
              </div>
              <Switch 
                checked={notificationPrefs.promotional} 
                onCheckedChange={(checked) => handleNotificationChange('promotional', checked)}
              />
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
                  defaultValue="TG"
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
