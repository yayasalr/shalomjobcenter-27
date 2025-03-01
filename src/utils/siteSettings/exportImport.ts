
import { SiteSettings } from '@/types/siteSettings';
import { validateSettings } from './validateSettings';

// Function to export settings
export const exportSettings = (settings: SiteSettings): boolean => {
  try {
    const settingsString = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shalomjobcenter-settings.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return true;
  } catch (error) {
    console.error('Error exporting settings:', error);
    return false;
  }
};

// Function to import settings
export const importSettings = async (file: File, setSettings: (settings: SiteSettings) => void): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedSettings = JSON.parse(content);
        
        // Validate imported settings
        if (!parsedSettings) {
          console.error('Invalid settings file');
          resolve(false);
          return;
        }
        
        // Merge with default settings to ensure valid structure
        const validatedSettings = validateSettings(parsedSettings);
        
        setSettings(validatedSettings);
        localStorage.setItem('siteSettings', JSON.stringify(validatedSettings));
        resolve(true);
      } catch (error) {
        console.error('Error importing settings:', error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(false);
    };
    
    reader.readAsText(file);
  });
};
