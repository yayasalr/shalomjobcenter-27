
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Clock } from 'lucide-react';

const NotificationFooter = () => {
  return (
    <div className="border-t flex justify-between pt-6">
      <Button variant="outline" asChild>
        <a href="/profile">
          <User className="mr-2 h-4 w-4" />
          Gérer mes préférences de notification
        </a>
      </Button>
      <Button variant="ghost" size="sm">
        <Clock className="mr-2 h-4 w-4" />
        Historique complet
      </Button>
    </div>
  );
};

export default NotificationFooter;
