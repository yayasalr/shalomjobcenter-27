
import { SiteSettings } from '@/types/siteSettings';

export const defaultSettings: SiteSettings = {
  siteName: 'SHALOM JOB CENTER',
  logo: '/lovable-uploads/be3553b7-65a1-46ed-a1cf-4ad67b03a0c2.png',
  primaryColor: '#FF385C', // Rouge Airbnb
  secondaryColor: '#222222', // Gris foncé
  language: 'fr',
  footer: {
    contact: 'Contactez-nous à contact@shalomjobcenter.fr',
    about: 'SHALOM JOB CENTER est une plateforme de location de logements et d\'emploi.',
    terms: 'Conditions d\'utilisation de la plateforme SHALOM JOB CENTER.',
    policy: 'Politique de confidentialité de SHALOM JOB CENTER.'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com'
  },
  reservationSettings: {
    minStay: 1,
    maxStay: 30,
    advanceBookingDays: 90,
    instantBooking: true
  },
  companyInfo: {
    address: '123 Rue Principale, Lomé, Togo',
    phone: '+228 12 34 56 78',
    email: 'info@shalomjobcenter.tg',
    registrationNumber: 'RCCM TG-LOM-2023-B-12345'
  },
  siteDescription: 'Plateforme de location de logements et de recherche d\'emploi',
  adminEmail: 'admin@shalomjobcenter.fr',
  supportEmail: 'support@shalomjobcenter.fr',
  phoneNumber: '+228 90 123 456',
  address: 'Lomé, Togo',
  favicon: '/favicon.ico',
  fontFamily: 'Inter',
  borderRadius: 'medium',
  darkMode: false,
  defaultLanguage: 'fr',
  defaultCurrency: 'XOF',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Lome',
  maxFileSize: 5,
  allowedFileTypes: 'jpg,jpeg,png,gif,pdf',
  imageCompression: 'medium',
  watermarkEnabled: false,
  watermarkOpacity: 50,
  watermarkImage: '/placeholder.svg',
  mailProvider: 'smtp',
  smtpHost: 'smtp.example.com',
  smtpPort: '587',
  smtpUser: 'user@example.com',
  smtpPassword: '',
  senderName: 'SHALOM JOB CENTER',
  senderEmail: 'no-reply@shalomjobcenter.fr',
  currency: 'XOF',
  stripeLiveKey: '',
  stripeTestKey: '',
  paypalClientId: '',
  testMode: true,
  commissionRate: 5,
  minWithdrawalAmount: 1000,
  facebookUrl: 'https://facebook.com/shalomjobcenter',
  twitterUrl: 'https://twitter.com/shalomjobcenter',
  instagramUrl: 'https://instagram.com/shalomjobcenter',
  linkedinUrl: 'https://linkedin.com/company/shalomjobcenter',
  youtubeUrl: '',
  enableSocialLogin: true,
  enableSocialSharing: true
};
