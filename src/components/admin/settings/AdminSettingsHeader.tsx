
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';

interface AdminSettingsHeaderProps {
  settings: SiteSettings;
  resetSettings: () => void;
  isMobileView: boolean;
  showMobileContent: boolean;
  setShowMobileContent: (show: boolean) => void;
}

export const AdminSettingsHeader: React.FC<AdminSettingsHeaderProps> = ({
  settings,
  resetSettings,
  isMobileView,
  showMobileContent,
  setShowMobileContent
}) => {
  return (
    <div className="bg-white border-b px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres du site</h1>
          <p className="mt-1 text-sm text-gray-500">
            Personnalisez l'apparence et le comportement de votre site
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <button
            onClick={resetSettings}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Réinitialiser
          </button>
          
          {isMobileView && (
            <button
              onClick={() => setShowMobileContent(!showMobileContent)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showMobileContent ? 'Fermer' : 'Modifier'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
