
import React from 'react';
import { MessageSquare } from 'lucide-react';

export const EmptyConversationState: React.FC = () => {
  return (
    <div className="col-span-2 flex flex-col h-full justify-center items-center rounded-r-lg whatsapp-container">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-4">
          <MessageSquare className="h-16 w-16 text-gray-400 opacity-50" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-3">Sélectionnez une conversation</h3>
        <p className="text-gray-500 mb-4">
          Choisissez une conversation dans la liste pour commencer à échanger des messages en temps réel avec vos utilisateurs.
        </p>
        <div className="text-sm text-gray-400 border-t border-gray-200 pt-4 mt-4">
          <p>Si vous ne voyez pas de messages, attendez que des utilisateurs vous contactent ou rafraîchissez la page.</p>
        </div>
      </div>
    </div>
  );
};
