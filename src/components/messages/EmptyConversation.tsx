
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyConversation: React.FC = () => {
  return (
    <div className="col-span-2 flex items-center justify-center h-full bg-[#f0f2f5] flex-col p-8">
      <MessageSquare className="h-16 w-16 text-green-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h3>
      <p className="text-gray-500 text-center max-w-md">
        Choisissez une conversation dans la liste pour afficher les messages en temps réel avec vos utilisateurs.
      </p>
    </div>
  );
};

export default EmptyConversation;
