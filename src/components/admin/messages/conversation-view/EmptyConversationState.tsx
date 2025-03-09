
import React from 'react';
import { MessageSquare } from 'lucide-react';

export const EmptyConversationState: React.FC = () => {
  return (
    <div className="col-span-2 flex flex-col h-full justify-center items-center whatsapp-message-area">
      <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-lg shadow-sm max-w-md text-center">
        <div className="p-4 rounded-full bg-[var(--whatsapp-green)]/10 mx-auto mb-6 w-fit">
          <MessageSquare className="h-16 w-16 text-[var(--whatsapp-green)] mx-auto opacity-80" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">Messages WhatsApp</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Sélectionnez une conversation dans la liste pour commencer à échanger des messages en temps réel avec vos utilisateurs.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Les messages sont envoyés et reçus instantanément, comme sur WhatsApp.
        </p>
      </div>
    </div>
  );
};
