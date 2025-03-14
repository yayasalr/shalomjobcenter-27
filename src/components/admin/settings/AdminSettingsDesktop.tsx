
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';

interface AdminSettingsDesktopProps {
  settings: SiteSettings;
}

export const AdminSettingsDesktop: React.FC<AdminSettingsDesktopProps> = ({
  settings
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Paramètres du site</h2>
        <p className="mt-1 text-sm text-gray-500">
          Consultez les paramètres actuels du site
        </p>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          {/* Informations générales */}
          <div className="sm:col-span-2">
            <h3 className="text-md font-medium text-gray-900 mb-4">Informations générales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du site
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.siteName}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du site
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.siteDescription}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email administrateur
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.adminEmail}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email support
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.supportEmail}
                </div>
              </div>
            </div>
          </div>
          
          {/* Apparence */}
          <div className="sm:col-span-2">
            <h3 className="text-md font-medium text-gray-900 mb-4">Apparence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur primaire
                </label>
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-md mr-2"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <div className="px-3 py-2 bg-gray-50 text-gray-800 flex-1 border border-gray-300 rounded-md sm:text-sm">
                    {settings.primaryColor}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur secondaire
                </label>
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-md mr-2"
                    style={{ backgroundColor: settings.secondaryColor }}
                  />
                  <div className="px-3 py-2 bg-gray-50 text-gray-800 flex-1 border border-gray-300 rounded-md sm:text-sm">
                    {settings.secondaryColor}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police de caractères
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.fontFamily}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rayon des bordures
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.borderRadius}
                </div>
              </div>
            </div>
          </div>
          
          {/* Informations de l'entreprise */}
          <div className="sm:col-span-2">
            <h3 className="text-md font-medium text-gray-900 mb-4">Informations de l'entreprise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.companyInfo.address}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.companyInfo.phone}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.companyInfo.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro d'enregistrement
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.companyInfo.registrationNumber}
                </div>
              </div>
            </div>
          </div>
          
          {/* Liens sociaux */}
          <div className="sm:col-span-2">
            <h3 className="text-md font-medium text-gray-900 mb-4">Liens sociaux</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.socialLinks.facebook}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.socialLinks.twitter}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.socialLinks.instagram}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <div className="px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md sm:text-sm">
                  {settings.socialLinks.linkedin}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
