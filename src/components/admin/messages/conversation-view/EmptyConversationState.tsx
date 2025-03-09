
import React from 'react';

export const EmptyConversationState: React.FC = () => {
  return (
    <div className="col-span-2 flex flex-col h-full justify-center items-center border rounded-r-lg bg-gray-50">
      <div className="text-center p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Sélectionnez une conversation</h3>
        <p className="text-gray-500">
          Choisissez une conversation dans la liste pour commencer à échanger des messages.
        </p>
      </div>
    </div>
  );
};
