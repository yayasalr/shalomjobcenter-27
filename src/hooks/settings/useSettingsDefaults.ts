
import { SiteSettings } from '@/types/siteSettings';

export const defaultSettings: Partial<SiteSettings> = {
  primaryColor: '#007BFF',
  secondaryColor: '#6C757D',
  logo: '/logo.png',
  logoUrl: '/logo.png',
  siteName: 'Shalom Job Center',
  favicon: '/favicon.ico',
  language: 'fr',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  darkMode: false, // Toujours désactivé
  footer: {
    contact: 'Contactez-nous pour plus d\'informations',
    about: 'SHALOM JOB CENTER est une agence de placement spécialisée dans le recrutement et le placement de personnel qualifié à Lomé, Togo.',
    terms: 'Conditions d\'utilisation',
    policy: 'Politique de confidentialité'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com'
  },
  companyInfo: {
    address: 'Tokoin Trésor, ancien immeuble Udecto, Lomé, Togo',
    phone: '+228 90-19-03-41',
    email: 'Shalomjob@gmail.com',
    registrationNumber: 'TG-LOM-01-2023-B12',
    mapLocation: '6.1796825,1.1272278'
  },
};
