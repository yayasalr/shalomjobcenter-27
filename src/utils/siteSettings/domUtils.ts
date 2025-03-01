
import { SiteSettings } from '@/types/siteSettings';

export const applySettingsToDOM = (settings: SiteSettings): void => {
  document.documentElement.style.setProperty('--primary', settings.primaryColor);
  document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
  
  // Colors for light mode (default)
  if (!settings.darkMode) {
    document.documentElement.style.setProperty('--background', '#F1F0FB'); // Background color (light gray)
    document.documentElement.style.setProperty('--foreground', '#1A1F2C'); // Text color (deep black)
    document.documentElement.style.setProperty('--card', '#FFFFFF');
    document.documentElement.style.setProperty('--card-foreground', '#1A1F2C');
    document.documentElement.style.setProperty('--popover', '#FFFFFF');
    document.documentElement.style.setProperty('--popover-foreground', '#1A1F2C');
    document.documentElement.style.setProperty('--muted', '#F1F5F9');
    document.documentElement.style.setProperty('--muted-foreground', '#64748B');
    document.documentElement.style.setProperty('--border', '#E2E8F0');
    document.documentElement.style.setProperty('--input', '#E2E8F0');
  } 
  // Colors for dark mode
  else {
    document.documentElement.style.setProperty('--background', '#1A1F2C'); // Dark background
    document.documentElement.style.setProperty('--foreground', '#F8FAFC'); // Light text
    document.documentElement.style.setProperty('--card', '#222222');
    document.documentElement.style.setProperty('--card-foreground', '#F8FAFC');
    document.documentElement.style.setProperty('--popover', '#222222');
    document.documentElement.style.setProperty('--popover-foreground', '#F8FAFC');
    document.documentElement.style.setProperty('--muted', '#333333');
    document.documentElement.style.setProperty('--muted-foreground', '#94A3B8');
    document.documentElement.style.setProperty('--border', '#333333');
    document.documentElement.style.setProperty('--input', '#333333');
  }
  
  document.documentElement.style.setProperty('--accent', '#D946EF'); // Accent color (magenta)
  
  // Apply dark mode class to the HTML element
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  console.log('Settings applied to DOM:', settings);
};
