
import { SiteSettings } from '@/types/siteSettings';

export const useSettingsUI = (settings: SiteSettings) => {
  const handleCompanyInfoChange = (field: keyof SiteSettings['companyInfo'], value: string) => {
    return {
      companyInfo: {
        ...settings.companyInfo,
        [field]: value,
      },
    };
  };

  const applySettingsToDOM = () => {
    // Apply custom CSS variables to the document root
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    
    // Récupérer le favicon réel si nécessaire
    let faviconSrc = settings.favicon;
    if (faviconSrc === 'stored_separately') {
      const storedFavicon = localStorage.getItem('site_favicon');
      if (storedFavicon) {
        faviconSrc = storedFavicon;
      } else {
        faviconSrc = '/favicon.ico'; // Fallback
      }
    }
    
    // Set the favicon dynamically
    if (faviconSrc) {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = faviconSrc;
      } else {
        const newFaviconLink = document.createElement('link');
        newFaviconLink.rel = 'icon';
        newFaviconLink.href = faviconSrc;
        document.head.appendChild(newFaviconLink);
      }
    }
  };

  return {
    handleCompanyInfoChange,
    applySettingsToDOM
  };
};
