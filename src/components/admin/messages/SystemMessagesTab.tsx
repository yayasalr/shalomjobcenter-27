
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SystemMessagesTab: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Bienvenue sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance."
  );
  
  // Charger le message stocké si disponible
  useEffect(() => {
    const storedMessage = localStorage.getItem('admin_welcome_message');
    if (storedMessage) {
      setWelcomeMessage(storedMessage);
    }
  }, []);
  
  const handleSaveWelcomeMessage = () => {
    // Enregistrer le message de bienvenue dans localStorage
    localStorage.setItem('admin_welcome_message', welcomeMessage);
    
    // Notification de succès
    toast.success("Configuration sauvegardée", {
      description: "Le message de bienvenue a été mis à jour avec succès."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des messages système</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Message de bienvenue</h3>
            <Textarea 
              className="min-h-[100px]"
              placeholder="Message envoyé automatiquement aux nouveaux utilisateurs..."
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce message sera envoyé automatiquement aux nouveaux utilisateurs lors de leur inscription.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveWelcomeMessage}>
              Enregistrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMessagesTab;
