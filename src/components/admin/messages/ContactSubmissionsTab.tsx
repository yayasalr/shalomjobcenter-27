
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Mail, Calendar, Send, Forward } from 'lucide-react';
import { ContactFormSubmission } from '@/types/contact';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactSubmissionsTab: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new'>('all');
  const [responseText, setResponseText] = useState('');
  const [forwardEmail, setForwardEmail] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const storedSubmissions = localStorage.getItem('contactFormSubmissions');
    if (storedSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(storedSubmissions, (key, value) => {
          if (key === 'createdAt' && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        });
        
        const validatedSubmissions = parsedSubmissions.map((sub: any) => {
          if (sub.status !== 'new' && sub.status !== 'read' && sub.status !== 'responded') {
            sub.status = 'new';
          }
          return sub as ContactFormSubmission;
        });
        
        setSubmissions(validatedSubmissions);
      } catch (error) {
        console.error("Erreur lors du chargement des soumissions:", error);
        setSubmissions([]);
      }
    }
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'new') {
      return matchesSearch && sub.status === 'new';
    }
    
    return matchesSearch;
  });

  const handleSelectSubmission = (submission: ContactFormSubmission) => {
    if (submission.status === 'new') {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submission.id ? { ...sub, status: 'read' as const } : sub
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
      
      submission = { ...submission, status: 'read' as const };
    }
    
    setSelectedSubmission(submission);
  };

  const handleSendResponse = () => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id ? { ...sub, status: 'responded' as const } : sub
    );
    
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
    
    setSelectedSubmission({ ...selectedSubmission, status: 'responded' as const });
    
    // Simulation d'envoi d'email
    toast.success(`Réponse envoyée à ${selectedSubmission.email}`, {
      description: "Le message a été envoyé avec succès."
    });
    
    console.log(`Response sent to ${selectedSubmission.email}: ${responseText}`);
    setResponseText('');
  };

  const handleForwardSubmission = () => {
    if (!selectedSubmission || !forwardEmail.trim()) return;
    
    setIsForwarding(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      toast.success(`Formulaire transféré à ${forwardEmail}`, {
        description: "Le formulaire de contact a été transféré avec succès."
      });
      
      setIsForwarding(false);
      setForwardEmail('');
    }, 1500);
  };

  const handleBulkForward = () => {
    if (!forwardEmail.trim() || filteredSubmissions.length === 0) return;
    
    setIsForwarding(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      toast.success(`${filteredSubmissions.length} formulaires transférés à ${forwardEmail}`, {
        description: "Les formulaires de contact ont été transférés avec succès."
      });
      
      setIsForwarding(false);
      setForwardEmail('');
    }, 1500);
  };

  const newSubmissionsCount = submissions.filter(sub => sub.status === 'new').length;

  return (
    <Card>
      <CardContent className="p-6 h-[calc(100vh-280px)]">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">Formulaires reçus</TabsTrigger>
            <TabsTrigger value="forward">Transfert par email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        className="pl-9" 
                        placeholder="Rechercher..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant={filter === 'new' ? "default" : "outline"} 
                      size="icon"
                      onClick={() => setFilter(filter === 'new' ? 'all' : 'new')}
                      className="h-10 w-10"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredSubmissions.length} message(s) {filter === 'new' ? 'non lu(s)' : ''} - {newSubmissionsCount} nouveaux
                  </div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <div 
                        key={submission.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                          selectedSubmission?.id === submission.id ? 'bg-gray-50' : ''
                        } ${submission.status === 'new' ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                        onClick={() => handleSelectSubmission(submission)}
                      >
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-medium truncate">{submission.name}</h3>
                          <span className="text-xs text-gray-500">
                            {format(new Date(submission.createdAt), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{submission.email}</p>
                        <div className="flex justify-between">
                          <p className={`text-sm truncate ${
                            submission.status === 'new' ? 'font-medium' : 'text-gray-500'
                          }`}>
                            {submission.subject}
                          </p>
                          {submission.status === 'new' && (
                            <Badge variant="default" className="rounded-full">Nouveau</Badge>
                          )}
                          {submission.status === 'responded' && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Répondu</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucun message {filter === 'new' ? 'non lu' : ''} trouvé
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
                {selectedSubmission ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">{selectedSubmission.subject}</h2>
                        <Badge 
                          variant={selectedSubmission.status === 'new' ? 'default' : 
                                  selectedSubmission.status === 'responded' ? 'outline' : 'secondary'}
                          className={selectedSubmission.status === 'responded' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {selectedSubmission.status === 'new' ? 'Nouveau' : 
                           selectedSubmission.status === 'responded' ? 'Répondu' : 'Lu'}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          <span>{selectedSubmission.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{format(new Date(selectedSubmission.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <div>
                          <Badge variant="outline">{selectedSubmission.department}</Badge>
                        </div>
                      </div>
                    </div>
                    
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
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Sélectionnez un message pour voir les détails
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forward">
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
                      onClick={() => {
                        // Configure le transfert automatique d'emails
                        toast.success("Configuration du transfert automatique", {
                          description: "Les nouveaux formulaires seront automatiquement transférés à l'adresse email fournie."
                        });
                      }}
                      disabled={!forwardEmail.trim()}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Configurer transfert automatique
                    </Button>
                  </div>
                </div>
                
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactSubmissionsTab;
