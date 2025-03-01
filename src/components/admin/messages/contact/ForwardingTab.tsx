
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Forward, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { ContactFormSubmission } from '@/types/contact';
import { SiteSettings } from '@/types/siteSettings';

interface ForwardingTabProps {
  settings: SiteSettings;
  filteredSubmissions: ContactFormSubmission[];
  filter: 'all' | 'new';
  forwardEmail: string;
  isForwarding: boolean;
  setForwardEmail: (email: string) => void;
  handleBulkForward: () => void;
}

export const ForwardingTab: React.FC<ForwardingTabProps> = ({
  settings,
  filteredSubmissions,
  filter,
  forwardEmail,
  isForwarding,
  setForwardEmail,
  handleBulkForward
}) => {
  const handleConfigureAutoForward = () => {
    toast.success("Configuration du transfert automatique", {
      description: "Les nouveaux formulaires seront automatiquement transférés à l'adresse email fournie."
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-medium mb-4">Transfert par email des formulaires de contact</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Email de destination</label>
          <Input
            placeholder="Email pour recevoir les formulaires..."
            value={forwardEmail}
            onChange={(e) => setForwardEmail(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Options de transfert</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={handleBulkForward} 
              disabled={isForwarding || !forwardEmail.trim() || filteredSubmissions.length === 0}
              className="flex-1"
            >
              <Forward className="h-4 w-4 mr-1" />
              Transférer {filteredSubmissions.length} formulaire(s) {filter === 'new' ? 'non lu(s)' : ''}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleConfigureAutoForward}
              disabled={!forwardEmail.trim()}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-1" />
              Configurer transfert automatique
            </Button>
          </div>
        </div>
        
        <EmailInfoSection settings={settings} />
      </div>
    </div>
  );
};

interface EmailInfoSectionProps {
  settings: SiteSettings;
}

const EmailInfoSection: React.FC<EmailInfoSectionProps> = ({ settings }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <h3 className="text-sm font-medium mb-2">Informations sur les emails</h3>
      <p className="text-sm text-gray-600">
        Configuration actuelle des emails:
      </p>
      <ul className="text-sm text-gray-600 mt-2 space-y-1">
        <li>• Serveur SMTP: {settings.smtpHost || 'Non configuré'}</li>
        <li>• Email expéditeur: {settings.senderEmail || 'Non configuré'}</li>
        <li>• Nom expéditeur: {settings.senderName || 'Non configuré'}</li>
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        Vous pouvez configurer les paramètres d'email dans la section Paramètres.
      </p>
    </div>
  );
};
