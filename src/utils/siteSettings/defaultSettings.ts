
import { SiteSettings } from '@/types/siteSettings';

export const defaultSettings: SiteSettings = {
  siteName: 'Shalom Job Center',
  logo: '/lovable-uploads/be3553b7-65a1-46ed-a1cf-4ad67b03a0c2.png',
  primaryColor: '#e41d48',
  secondaryColor: '#1d4ed8',
  language: 'fr',
  footer: {
    contact: 'Contactez-nous pour toute question concernant nos services de location ou nos offres d\'emploi.',
    about: 'Shalom Job Center est une plateforme dédiée à la mise en relation des candidats avec des opportunités d\'emploi et de logement au Togo.',
    terms: 'En utilisant notre service, vous acceptez nos conditions générales d\'utilisation et notre politique de confidentialité.',
    policy: 'Nous respectons votre vie privée et protégeons vos données personnelles conformément aux lois en vigueur.',
  },
  socialLinks: {
    facebook: 'https://facebook.com/shalomjobcenter',
    twitter: 'https://twitter.com/shalomjobcenter',
    instagram: 'https://instagram.com/shalomjobcenter',
    linkedin: 'https://linkedin.com/company/shalomjobcenter',
  },
  reservationSettings: {
    minStay: 1,
    maxStay: 90,
    advanceBookingDays: 365,
    instantBooking: true,
  },
  companyInfo: {
    address: '123 Rue Principale, Lomé, Togo',
    phone: '+228 12 34 56 78',
    email: 'info@shalomjobcenter.tg',
    registrationNumber: 'RCCM TG-LOM-2023-B-12345',
    mapLocation: '6.1317,1.2232' // Added Lomé, Togo coordinates
  },
  siteDescription: 'Plateforme de location de logements et de recherche d\'emploi',
  adminEmail: 'admin@shalomjobcenter.fr',
  supportEmail: 'support@shalomjobcenter.fr',
  phoneNumber: '+228 12 34 56 78',
  address: '123 Rue Principale, Lomé, Togo',
  favicon: '/favicon.ico',
  fontFamily: 'Inter, sans-serif',
  borderRadius: 'medium',
  darkMode: false,
  defaultLanguage: 'fr',
  defaultCurrency: 'XOF',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: '24h',
  timezone: 'Africa/Lome',
  maxFileSize: 5, // MB
  allowedFileTypes: 'image/jpeg,image/png,image/gif',
  imageCompression: 'medium',
  watermarkEnabled: false,
  watermarkOpacity: 0.5,
  watermarkImage: '',
  mailProvider: 'smtp',
  smtpHost: 'smtp.example.com',
  smtpPort: '587',
  smtpUser: 'user@example.com',
  smtpPassword: 'password',
  senderName: 'Shalom Job Center',
  senderEmail: 'no-reply@shalomjobcenter.tg',
  currency: 'XOF',
  stripeLiveKey: '',
  stripeTestKey: '',
  paypalClientId: '',
  testMode: true,
  commissionRate: 10,
  minWithdrawalAmount: 10000,
  facebookUrl: 'https://facebook.com/shalomjobcenter',
  twitterUrl: 'https://twitter.com/shalomjobcenter',
  instagramUrl: 'https://instagram.com/shalomjobcenter',
  linkedinUrl: 'https://linkedin.com/company/shalomjobcenter',
  youtubeUrl: '',
  enableSocialLogin: true,
  enableSocialSharing: true,
  logoUrl: '/lovable-uploads/be3553b7-65a1-46ed-a1cf-4ad67b03a0c2.png',
  notificationSettings: {
    emailNotifications: true,
    newContactFormAlert: true,
    contactFormEmailTemplate: `Cher administrateur,

Un nouveau formulaire de contact a été soumis sur votre site.

Nom: {name}
Email: {email}
Département: {department}
Sujet: {subject}

Message:
{message}

Cordialement,
L'équipe Shalom Job Center`
  }
};
