
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  LifeBuoy, 
  MessageSquare, 
  Users, 
  Clock, 
  Search, 
  SendHorizontal,
  MessageSquareDashed,
  PanelRight,
  User,
  Filter,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  Flag
} from 'lucide-react';

// Types pour simuler les données
interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userType: 'host' | 'guest';
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  sender: 'user' | 'support';
  senderName: string;
  senderAvatar?: string;
}

const AdminSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Données simulées - tickets de support
  const tickets: SupportTicket[] = [
    {
      id: "1",
      subject: "Problème avec une réservation",
      description: "Je n'arrive pas à voir ma réservation confirmée et je n'ai pas reçu de mail de confirmation.",
      status: 'open',
      priority: 'high',
      createdAt: '2024-04-01T10:30:00',
      updatedAt: '2024-04-01T10:30:00',
      userId: '101',
      userName: 'Jean Dupont',
      userAvatar: '/placeholder.svg',
      userType: 'guest',
      messages: [
        {
          id: "m1",
          ticketId: "1",
          content: "Bonjour, je n'arrive pas à voir ma réservation confirmée et je n'ai pas reçu de mail de confirmation. Pouvez-vous m'aider ?",
          createdAt: '2024-04-01T10:30:00',
          sender: 'user',
          senderName: 'Jean Dupont',
          senderAvatar: '/placeholder.svg',
        }
      ]
    },
    {
      id: "2",
      subject: "Comment ajouter des photos à mon annonce ?",
      description: "Je souhaite ajouter plusieurs photos à mon annonce mais je n'arrive pas à les télécharger correctement.",
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-03-30T15:45:00',
      updatedAt: '2024-03-31T09:15:00',
      userId: '102',
      userName: 'Marie Martin',
      userType: 'host',
      messages: [
        {
          id: "m2",
          ticketId: "2",
          content: "Bonjour, je souhaite ajouter plusieurs photos à mon annonce mais je n'arrive pas à les télécharger correctement. Pouvez-vous m'indiquer la procédure ?",
          createdAt: '2024-03-30T15:45:00',
          sender: 'user',
          senderName: 'Marie Martin',
        },
        {
          id: "m3",
          ticketId: "2",
          content: "Bonjour Marie, pour ajouter des photos à votre annonce, vous pouvez aller dans la section 'Mes annonces', cliquer sur 'Modifier' puis sur 'Photos'. Vous pourrez alors télécharger jusqu'à 20 photos. Assurez-vous que chaque photo ne dépasse pas 5 Mo et est au format JPG ou PNG. N'hésitez pas si vous avez d'autres questions !",
          createdAt: '2024-03-31T09:15:00',
          sender: 'support',
          senderName: 'Support Technique',
          senderAvatar: '/placeholder.svg',
        }
      ]
    },
    {
      id: "3",
      subject: "Remboursement non reçu",
      description: "J'ai annulé une réservation il y a 10 jours mais je n'ai toujours pas reçu mon remboursement.",
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-03-25T11:20:00',
      updatedAt: '2024-03-27T14:40:00',
      userId: '103',
      userName: 'Thomas Petit',
      userType: 'guest',
      messages: [
        {
          id: "m4",
          ticketId: "3",
          content: "Bonjour, j'ai annulé une réservation il y a 10 jours mais je n'ai toujours pas reçu mon remboursement. Pouvez-vous vérifier où en est la procédure ?",
          createdAt: '2024-03-25T11:20:00',
          sender: 'user',
          senderName: 'Thomas Petit',
        },
        {
          id: "m5",
          ticketId: "3",
          content: "Bonjour Thomas, je vérifie immédiatement votre dossier. Pouvez-vous me confirmer la référence de votre réservation ?",
          createdAt: '2024-03-25T14:30:00',
          sender: 'support',
          senderName: 'Support Technique',
          senderAvatar: '/placeholder.svg',
        },
        {
          id: "m6",
          ticketId: "3",
          content: "La référence est RES-2024-03-15-789. Merci de votre aide.",
          createdAt: '2024-03-26T09:10:00',
          sender: 'user',
          senderName: 'Thomas Petit',
        },
        {
          id: "m7",
          ticketId: "3",
          content: "Merci Thomas. J'ai vérifié et le remboursement a bien été initié le 18 mars. Selon votre banque, le délai de traitement peut prendre jusqu'à 14 jours ouvrables. Vous devriez le recevoir d'ici la fin de semaine. N'hésitez pas à revenir vers nous si ce n'est pas le cas après cette date.",
          createdAt: '2024-03-26T11:45:00',
          sender: 'support',
          senderName: 'Support Technique',
          senderAvatar: '/placeholder.svg',
        },
        {
          id: "m8",
          ticketId: "3",
          content: "Parfait, merci pour ces informations. J'attendrai la fin de la semaine.",
          createdAt: '2024-03-26T12:20:00',
          sender: 'user',
          senderName: 'Thomas Petit',
        },
        {
          id: "m9",
          ticketId: "3",
          content: "J'ai bien reçu mon remboursement aujourd'hui. Merci pour votre aide !",
          createdAt: '2024-03-27T14:40:00',
          sender: 'user',
          senderName: 'Thomas Petit',
        }
      ]
    },
    {
      id: "4",
      subject: "Demande de suppression de compte",
      description: "Je souhaite supprimer mon compte et toutes mes données personnelles de votre plateforme.",
      status: 'closed',
      priority: 'medium',
      createdAt: '2024-03-20T09:00:00',
      updatedAt: '2024-03-22T16:30:00',
      userId: '104',
      userName: 'Sophie Bernard',
      userType: 'guest',
      messages: [
        {
          id: "m10",
          ticketId: "4",
          content: "Bonjour, je souhaite supprimer mon compte et toutes mes données personnelles de votre plateforme. Comment dois-je procéder ?",
          createdAt: '2024-03-20T09:00:00',
          sender: 'user',
          senderName: 'Sophie Bernard',
        },
        {
          id: "m11",
          ticketId: "4",
          content: "Bonjour Sophie, nous regrettons de vous voir partir. Pour supprimer votre compte, vous pouvez aller dans 'Paramètres du compte' puis 'Confidentialité' et enfin 'Supprimer mon compte'. Veuillez noter que cette action est irréversible et que toutes vos données seront définitivement supprimées sous 30 jours conformément au RGPD. Si vous avez des réservations en cours, vous devrez d'abord les annuler ou les terminer.",
          createdAt: '2024-03-20T11:15:00',
          sender: 'support',
          senderName: 'Support Technique',
          senderAvatar: '/placeholder.svg',
        },
        {
          id: "m12",
          ticketId: "4",
          content: "Merci pour ces informations. J'ai suivi la procédure et supprimé mon compte.",
          createdAt: '2024-03-22T16:30:00',
          sender: 'user',
          senderName: 'Sophie Bernard',
        }
      ]
    }
  ];

  // Filtrer les tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la couleur du badge en fonction du statut
  const getStatusBadgeColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return '';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  };

  // Obtenir la couleur du badge en fonction de la priorité
  const getPriorityBadgeColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  // Obtenir le texte de la priorité en français
  const getPriorityText = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return 'Basse';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Haute';
      case 'urgent':
        return 'Urgente';
      default:
        return priority;
    }
  };

  // Gérer l'envoi d'un nouveau message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    // Dans une application réelle, vous enverriez le message à l'API
    toast.success("Message envoyé");
    setNewMessage("");
  };

  // Gérer le changement de statut d'un ticket
  const handleChangeTicketStatus = (ticket: SupportTicket, newStatus: SupportTicket['status']) => {
    // Dans une application réelle, vous mettriez à jour le statut via une API
    toast.success(`Statut du ticket mis à jour à: ${getStatusText(newStatus)}`);
    
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Support et assistance</h1>
            <p className="text-gray-500">Gérez les demandes d'assistance des utilisateurs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des tickets */}
            <div className="lg:col-span-1">
              <Card className="h-[calc(100vh-14rem)]">
                <CardHeader className="pb-3">
                  <CardTitle>Tickets de support</CardTitle>
                  <CardDescription>
                    {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                  </CardDescription>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher des tickets..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="p-2 border rounded-md bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="open">Ouverts</option>
                      <option value="in_progress">En cours</option>
                      <option value="resolved">Résolus</option>
                      <option value="closed">Fermés</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <div className="space-y-2">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedTicket?.id === ticket.id ? 'bg-gray-50 border-primary' : ''
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium line-clamp-1">{ticket.subject}</h3>
                            <Badge
                              className={getStatusBadgeColor(ticket.status)}
                              variant="outline"
                            >
                              {getStatusText(ticket.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{ticket.userName}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge
                              variant="outline"
                              className={getPriorityBadgeColor(ticket.priority)}
                            >
                              {getPriorityText(ticket.priority)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(ticket.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {filteredTickets.length === 0 && (
                        <div className="text-center p-6 text-gray-500">
                          <MessageSquareDashed className="h-10 w-10 mx-auto mb-2" />
                          <p>Aucun ticket de support trouvé</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Détail du ticket */}
            <div className="lg:col-span-2">
              <Card className="h-[calc(100vh-14rem)]">
                {selectedTicket ? (
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedTicket.subject}</CardTitle>
                          <CardDescription>
                            Ticket #{selectedTicket.id} • Créé le {formatDate(selectedTicket.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {selectedTicket.status !== 'closed' && (
                            <>
                              {selectedTicket.status === 'open' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleChangeTicketStatus(selectedTicket, 'in_progress')}
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Prendre en charge
                                </Button>
                              )}
                              {selectedTicket.status === 'in_progress' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                  onClick={() => handleChangeTicketStatus(selectedTicket, 'resolved')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Marquer comme résolu
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                                onClick={() => handleChangeTicketStatus(selectedTicket, 'closed')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Fermer
                              </Button>
                            </>
                          )}
                          {selectedTicket.status === 'closed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleChangeTicketStatus(selectedTicket, 'open')}
                            >
                              <Flag className="h-4 w-4 mr-1" />
                              Rouvrir
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getStatusBadgeColor(selectedTicket.status)}>
                          {getStatusText(selectedTicket.status)}
                        </Badge>
                        <Badge className={getPriorityBadgeColor(selectedTicket.priority)}>
                          Priorité: {getPriorityText(selectedTicket.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {selectedTicket.userType === 'host' ? 'Hôte' : 'Voyageur'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            {selectedTicket.userAvatar ? (
                              <AvatarImage src={selectedTicket.userAvatar} alt={selectedTicket.userName} />
                            ) : null}
                            <AvatarFallback>{selectedTicket.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{selectedTicket.userName}</h4>
                            <p className="text-xs text-gray-500">{formatDate(selectedTicket.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-sm">{selectedTicket.description}</p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-sm mb-3">Conversation</h4>
                        <ScrollArea className="h-[calc(100vh-36rem)]">
                          <div className="space-y-4">
                            {selectedTicket.messages.map((message) => (
                              <div key={message.id} className="flex">
                                <Avatar className="h-8 w-8 mr-2">
                                  {message.senderAvatar ? (
                                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                  ) : null}
                                  <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-baseline">
                                    <h5 className="font-medium text-sm">
                                      {message.senderName}
                                      {message.sender === 'support' && (
                                        <Badge variant="outline" className="ml-2 text-xs">Support</Badge>
                                      )}
                                    </h5>
                                    <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                                  </div>
                                  <p className="text-sm mt-1">{message.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                    {selectedTicket.status !== 'closed' && (
                      <CardFooter className="border-t pt-4">
                        <div className="flex w-full space-x-2">
                          <Textarea
                            placeholder="Écrivez votre réponse..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage}>
                            <SendHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Sélectionnez un ticket</h3>
                      <p className="text-gray-500 max-w-md">
                        Choisissez un ticket de support dans la liste pour voir les détails et y répondre.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSupport;
