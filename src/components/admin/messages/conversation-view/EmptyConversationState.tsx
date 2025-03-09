
import React from 'react';
import { MessageSquare } from 'lucide-react';

export const EmptyConversationState: React.FC = () => {
  return (
    <div className="col-span-2 flex flex-col h-full justify-center items-center whatsapp-message-area">
      <div className="bg-white/80 p-8 rounded-lg shadow-sm max-w-md text-center">
        <MessageSquare className="h-16 w-16 text-[#00a884] mb-4 mx-auto opacity-70" />
        <h3 className="text-xl font-medium text-gray-700 mb-3">Messages WhatsApp</h3>
        <p className="text-gray-500 mb-4">
          Sélectionnez une conversation dans la liste pour commencer à échanger des messages en temps réel avec vos utilisateurs.
        </p>
        <p className="text-xs text-gray-400 mt-6">
          Toutes les conversations sont chiffrées de bout en bout, comme sur WhatsApp.
        </p>
      </div>
    </div>
  );
};
