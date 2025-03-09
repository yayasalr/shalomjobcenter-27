
import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useSiteSettings } from '@/hooks/useSiteSettings';
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
  region: string;
}

export const usePreferences = () => {
  const { getItem, setItem } = useLocalStorage();
  const { updateSettings } = useSiteSettings();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    accentColor: getItem('user_accent_color', '#FF385C'),
    layout: getItem('user_layout', 'default'),
    notifications: getItem('user_notification_preferences', {
      email: true,
      push: true,
      reservation: true,
      promotional: false
    }),
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
      primaryColor: preferences.accentColor || '#FF385C'
    });
    
    toast.success("Préférences enregistrées avec succès");
  };

  return {
    preferences,
    updatePreference,
    savePreferences
  };
};
