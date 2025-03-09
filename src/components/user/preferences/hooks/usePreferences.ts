
import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useSiteSettings } from '@/hooks/settings';
import { toast } from 'sonner';

export interface UserPreferences {
  accentColor: string;
  layout: string;
  notifications: {
    email: boolean;
    push: boolean;
    reservation: boolean;
    promotional: boolean;
  };
  language: "fr" | "en";
  region: string;
}

export const usePreferences = () => {
  const { getItem, setItem } = useLocalStorage();
  const { updateSettings } = useSiteSettings();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    accentColor: getItem('user_accent_color', 'purple'),
    layout: getItem('user_layout', 'default'),
    notifications: getItem('user_notification_preferences', {
      email: true,
      push: true,
      reservation: true,
      promotional: false
    }),
    language: getItem('user_language', 'fr') as "fr" | "en",
    region: getItem('user_region', 'TG')
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = () => {
    // Save each preference to local storage
    Object.entries(preferences).forEach(([key, value]) => {
      setItem(`user_${key}`, value);
    });
    
    // Update settings in context if needed
    updateSettings({ 
      primaryColor: document.documentElement.style.getPropertyValue('--accent-color') || '#8B5CF6',
      language: preferences.language
    });
    
    toast.success("Préférences enregistrées avec succès");
  };

  return {
    preferences,
    updatePreference,
    savePreferences
  };
};
