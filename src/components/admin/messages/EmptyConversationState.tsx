
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyConversationState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full flex-col p-8">
      <div className="bg-white/80 p-8 rounded-lg shadow-sm max-w-md text-center">
        <MessageSquare className="h-16 w-16 text-[#00a884] mb-4 mx-auto" />
        <h3 className="text-xl font-semibold mb-2">WhatsApp Web</h3>
        <p className="text-gray-500 text-center">
          Sélectionnez une conversation dans la liste pour afficher les messages en temps réel avec vos utilisateurs.
        </p>
        <p className="text-xs text-gray-400 mt-6">
          Toutes les conversations sont chiffrées de bout en bout, comme sur WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default EmptyConversationState;
