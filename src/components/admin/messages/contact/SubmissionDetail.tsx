
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Calendar, Send, Forward, ChevronLeft } from 'lucide-react';
import { ContactFormSubmission } from '@/types/contact';
import { format } from 'date-fns';

interface SubmissionDetailProps {
  selectedSubmission: ContactFormSubmission | null;
  responseText: string;
  forwardEmail: string;
  isForwarding: boolean;
  setResponseText: (text: string) => void;
  setForwardEmail: (email: string) => void;
  handleSendResponse: () => void;
  handleForwardSubmission: () => void;
  onBack?: () => void; // Add the onBack prop as optional
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({
  selectedSubmission,
  responseText,
  forwardEmail,
  isForwarding,
  setResponseText,
  setForwardEmail,
  handleSendResponse,
  handleForwardSubmission,
  onBack
}) => {
  if (!selectedSubmission) {
    return (
      <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-center h-full text-gray-500">
          Sélectionnez un message pour voir les détails
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
      <SubmissionHeader 
        submission={selectedSubmission} 
        onBack={onBack}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">De: {selectedSubmission.name}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{selectedSubmission.message}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <ResponseSection
        responseText={responseText}
        forwardEmail={forwardEmail}
        isForwarding={isForwarding}
        setResponseText={setResponseText}
        setForwardEmail={setForwardEmail}
        handleSendResponse={handleSendResponse}
        handleForwardSubmission={handleForwardSubmission}
      />
    </div>
  );
};

interface SubmissionHeaderProps {
  submission: ContactFormSubmission;
  onBack?: () => void;
}

const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({ submission, onBack }) => {
  return (
    <div className="p-4 border-b">
      {onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="md:hidden mb-2 -ml-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
      )}
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">{submission.subject}</h2>
        <Badge 
          variant={submission.status === 'new' ? 'default' : 
                 submission.status === 'responded' ? 'outline' : 'secondary'}
          className={submission.status === 'responded' ? 'bg-green-100 text-green-800' : ''}
        >
          {submission.status === 'new' ? 'Nouveau' : 
          submission.status === 'responded' ? 'Répondu' : 'Lu'}
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-1" />
          <span>{submission.email}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{format(new Date(submission.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div>
          <Badge variant="outline">{submission.department}</Badge>
        </div>
      </div>
    </div>
  );
};

interface ResponseSectionProps {
  responseText: string;
  forwardEmail: string;
  isForwarding: boolean;
  setResponseText: (text: string) => void;
  setForwardEmail: (email: string) => void;
  handleSendResponse: () => void;
  handleForwardSubmission: () => void;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({
  responseText,
  forwardEmail,
  isForwarding,
  setResponseText,
  setForwardEmail,
  handleSendResponse,
  handleForwardSubmission
}) => {
  return (
    <div className="p-4 border-t">
      <div className="mb-2">
        <h3 className="font-medium">Répondre</h3>
      </div>
      <div className="flex gap-2">
        <Textarea 
          placeholder="Écrivez votre réponse..." 
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          className="min-h-[60px] resize-none"
        />
        <Button onClick={handleSendResponse} className="h-[60px]">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Input
          placeholder="Email pour transfert..."
          value={forwardEmail}
          onChange={(e) => setForwardEmail(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleForwardSubmission} 
          variant="outline" 
          className="whitespace-nowrap"
          disabled={isForwarding || !forwardEmail.trim()}
        >
          <Forward className="h-4 w-4 mr-1" />
          Transférer
        </Button>
      </div>
    </div>
  );
};
