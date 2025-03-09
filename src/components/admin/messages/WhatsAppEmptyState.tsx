
import React from 'react';

export const WhatsAppEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
      <div className="w-16 h-16 mb-6 text-green-500">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.44,13.04c0.01-0.2,0.01-0.4,0.01-0.6c0-4.42-3.58-8-8-8s-8,3.58-8,8c0,4.42,3.58,8,8,8c1.45,0,2.81-0.39,3.99-1.07 l4.26,1.07l-1.07-4.26C19.19,15.25,19.44,14.15,19.44,13.04z M13.85,15.14l-5.71-5.71l1.42-1.42l4.29,4.29l7.29-7.29l1.42,1.42 L13.85,15.14z"/>
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">WhatsApp Web</h2>
      <p className="text-center text-gray-600 mb-4 max-w-md">
        Sélectionnez une conversation dans la liste pour afficher les messages en temps réel avec vos utilisateurs.
      </p>
      <p className="text-xs text-gray-400 text-center max-w-sm">
        Toutes les conversations sont chiffrées de bout en bout, comme sur WhatsApp.
      </p>
    </div>
  );
};
