
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';

interface AdminSettingsMobileProps {
  settings: SiteSettings;
  showMobileContent: boolean;
  setShowMobileContent: (show: boolean) => void;
}

export const AdminSettingsMobile: React.FC<AdminSettingsMobileProps> = ({
  settings,
  showMobileContent,
  setShowMobileContent
}) => {
  if (!showMobileContent) {
    // Afficher un résumé des paramètres lorsque le contenu détaillé n'est pas affiché
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Paramètres actuels</h2>
          <button
            onClick={() => setShowMobileContent(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Modifier
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-1/3">Nom du site:</span>
            <span className="text-sm text-gray-900">{settings.siteName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-1/3">Couleur primaire:</span>
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: settings.primaryColor }}
              />
              <span className="text-sm text-gray-900">{settings.primaryColor}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-1/3">Email:</span>
            <span className="text-sm text-gray-900">{settings.companyInfo.email}</span>
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'interface de modification des paramètres
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Modifier les paramètres</h2>
        <button
          onClick={() => setShowMobileContent(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Fermer
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Paramètres généraux */}
        <section>
          <h3 className="text-md font-medium text-gray-900 mb-3">Paramètres généraux</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de l'entreprise
              </label>
              <input
                type="email"
                value={settings.companyInfo.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
          </div>
        </section>
        
        {/* Couleurs */}
        <section>
          <h3 className="text-md font-medium text-gray-900 mb-3">Couleurs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur primaire
              </label>
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-md mr-2"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
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
                <input
                  type="text"
                  value={settings.secondaryColor}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>
        
        <div className="pt-4">
          <button
            onClick={() => setShowMobileContent(false)}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
