
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyConversation: React.FC = () => {
  return (
    <div className="col-span-2 flex items-center justify-center h-full whatsapp-message-area flex-col p-8">
      <div className="bg-white/80 p-8 rounded-lg shadow-sm max-w-md text-center">
        <MessageSquare className="h-16 w-16 text-[#00a884] mb-4 mx-auto" />
        <h3 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h3>
        <p className="text-gray-500 text-center">
          Choisissez une conversation dans la liste pour afficher les messages en temps réel avec vos utilisateurs.
        </p>
      </div>
    </div>
  );
};

export default EmptyConversation;
