
import { SiteSettings } from '@/types/siteSettings';
import { defaultSettings } from '../useSettingsDefaults';

export type SiteSettingsRow = {
  id: string;
  site_name: string;
  primary_color: string;
  secondary_color: string;
  favicon_url: string | null;
  logo_url: string | null;
  company_name: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_email: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Convertit une ligne de la base de données en objet SiteSettings
 */
export const convertRowToSettings = (row: SiteSettingsRow): SiteSettings => {
  return {
    ...defaultSettings,
    siteName: row.site_name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    favicon: row.favicon_url || defaultSettings.favicon,
    logo: row.logo_url || defaultSettings.logo,
    companyInfo: {
      ...defaultSettings.companyInfo,
      name: row.company_name || defaultSettings.companyInfo.name,
      address: row.company_address || defaultSettings.companyInfo.address,
      phone: row.company_phone || defaultSettings.companyInfo.phone,
      email: row.company_email || defaultSettings.companyInfo.email,
    }
  };
};

/**
 * Convertit un objet SiteSettings en données pour Supabase
 */
export const convertSettingsToRow = (settings: SiteSettings) => {
  return {
    site_name: settings.siteName,
    primary_color: settings.primaryColor,
    secondary_color: settings.secondaryColor,
    logo_url: settings.logo,
    favicon_url: settings.favicon,
    company_name: settings.companyInfo?.name,
    company_address: settings.companyInfo?.address,
    company_phone: settings.companyInfo?.phone,
    company_email: settings.companyInfo?.email,
    updated_at: new Date().toISOString()
  };
};
