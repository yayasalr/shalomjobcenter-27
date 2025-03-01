
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Filter, Users, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

// Types pour les données
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    avatar?: string;
    email?: string; 
    role?: 'user' | 'host' | 'admin';
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    read: boolean;
    sender: 'user' | 'admin';
  };
  messages: Message[];
}

const AdminMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Charger les conversations depuis le localStorage
  useEffect(() => {
    // Simulation de la récupération des conversations
    const allUserConversations: Conversation[] = [];
    
    // Parcourir le localStorage pour trouver toutes les conversations des utilisateurs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('conversations_')) {
        try {
          const userId = key.replace('conversations_', '');
          const userConversations = JSON.parse(localStorage.getItem(key) || '[]', (k, v) => {
            if (k === 'timestamp' && typeof v === 'string') {
              return new Date(v);
            }
            return v;
          });
          
          // Filtrer pour trouver les conversations avec l'admin
          const adminConvs = userConversations.filter((conv: Conversation) => 
            conv.with.id === 'admin'
          );
          
          if (adminConvs.length > 0) {
            // Trouver les informations de l'utilisateur
            const userData = JSON.parse(localStorage.getItem('users') || '[]').find(
              (u: any) => u.id === userId
            );
            
            if (userData) {
              // Transformer la conversation pour le point de vue de l'admin
              const adminConv = adminConvs[0];
              const transformedConv: Conversation = {
                id: `admin-${userId}`,
                with: {
                  id: userId,
                  name: userData.name,
                  email: userData.email,
                  avatar: userData.avatar || '/placeholder.svg',
                  role: userData.role,
                },
                lastMessage: {
                  ...adminConv.lastMessage,
                  // Inverser le sender
                  sender: adminConv.lastMessage.sender === 'user' ? 'user' : 'admin',
                },
                messages: adminConv.messages.map(msg => ({
                  ...msg,
                  // Inverser le sender
                  sender: msg.sender === 'user' ? 'user' : 'admin',
                })),
              };
              
              allUserConversations.push(transformedConv);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la lecture des conversations:", error);
        }
      }
    }
    
    // Trier par date du dernier message (le plus récent en premier)
    allUserConversations.sort((a, b) => 
      b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
    
    setConversations(allUserConversations);
    
    if (allUserConversations.length > 0) {
      setSelectedConversation(allUserConversations[0]);
    }
  }, []);

  // Enregistrer les conversations modifiées dans le localStorage
  const updateUserConversation = (userId: string, updatedConversation: Conversation) => {
    try {
      const key = `conversations_${userId}`;
      const userConversations = JSON.parse(localStorage.getItem(key) || '[]', (k, v) => {
        if (k === 'timestamp' && typeof v === 'string') {
          return new Date(v);
        }
        return v;
      });
      
      // Trouver et mettre à jour la conversation avec l'admin
      const updatedUserConversations = userConversations.map((conv: Conversation) => {
        if (conv.with.id === 'admin') {
          // Créer une version transformée pour l'utilisateur
          return {
            ...conv,
            lastMessage: {
              content: updatedConversation.lastMessage.content,
              timestamp: updatedConversation.lastMessage.timestamp,
              read: false, // Toujours marquer comme non lu pour l'utilisateur
              sender: updatedConversation.lastMessage.sender === 'admin' ? 'admin' : 'user',
            },
            messages: updatedConversation.messages.map(msg => ({
              ...msg,
              sender: msg.sender === 'admin' ? 'admin' : 'user',
              read: msg.sender === 'user', // Les messages de l'utilisateur sont lus, ceux de l'admin non
            })),
          };
        }
        return conv;
      });
      
      localStorage.setItem(key, JSON.stringify(updatedUserConversations));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des conversations:", error);
    }
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      read: true,
    };
    
    // Mettre à jour la conversation sélectionnée
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp: new Date(),
        read: true,
        sender: 'admin',
      },
    };
    
    // Mettre à jour l'état des conversations
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    setNewMessage('');
    
    // Mettre à jour la conversation de l'utilisateur dans le localStorage
    updateUserConversation(selectedConversation.with.id, updatedSelectedConversation);
    
    toast.success("Message envoyé avec succès");
  };

  // Filtrer les conversations en fonction de la recherche et du filtre
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.with.email && conv.with.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      const hasUnread = conv.messages.some(msg => !msg.read && msg.sender === 'user');
      return matchesSearch && hasUnread;
    }
    
    return matchesSearch;
  });

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  const handleSelectConversation = (conversation: Conversation) => {
    // Marquer tous les messages utilisateur comme lus
    const updatedMessages = conversation.messages.map(msg => ({
      ...msg,
      read: true
    }));
    
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      lastMessage: {
        ...conversation.lastMessage,
        read: true
      }
    };
    
    // Mettre à jour l'état des conversations
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id ? updatedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    
    // Mettre à jour dans le localStorage
    updateUserConversation(conversation.with.id, updatedConversation);
  };

  // Compter les messages non lus
  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => !msg.read && msg.sender === 'user').length;
  };

  // Compter le total des messages non lus
  const totalUnreadCount = conversations.reduce((count, conv) => {
    return count + getUnreadCount(conv);
  }, 0);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      
      <div className="flex flex-col">
        <AdminTopbar />
        
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
              {totalUnreadCount} non lus
            </Badge>
          </div>
          
          <Tabs defaultValue="messages" className="w-full">
            <TabsList>
              <TabsTrigger value="messages" className="flex gap-2">
                <Users className="h-4 w-4" />
                Messages des utilisateurs
              </TabsTrigger>
              <TabsTrigger value="system" className="flex gap-2">
                <User className="h-4 w-4" />
                Messages système
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardContent className="p-6 h-[calc(100vh-280px)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
                    {/* Liste des conversations */}
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
                            variant={filter === 'unread' ? "default" : "outline"} 
                            size="icon"
                            onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
                            className="h-10 w-10"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                          {filteredConversations.length} conversation(s) {filter === 'unread' ? 'non lue(s)' : ''}
                        </div>
                      </div>
                      
                      <ScrollArea className="h-[calc(100vh-400px)]">
                        {filteredConversations.length > 0 ? (
                          filteredConversations.map((conversation) => {
                            const unreadCount = getUnreadCount(conversation);
                            
                            return (
                              <div 
                                key={conversation.id}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                                } ${unreadCount > 0 ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src={conversation.with.avatar} />
                                    <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                      <h3 className="font-medium truncate">{conversation.with.name}</h3>
                                      <span className="text-xs text-gray-500">
                                        {conversation.lastMessage.timestamp.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{conversation.with.email}</p>
                                    <div className="flex justify-between mt-1">
                                      <p className={`text-sm truncate ${
                                        unreadCount > 0 ? 'font-medium' : 'text-gray-500'
                                      }`}>
                                        {conversation.lastMessage.sender === 'admin' ? 'Vous: ' : ''}
                                        {conversation.lastMessage.content}
                                      </p>
                                      {unreadCount > 0 && (
                                        <Badge variant="default" className="rounded-full h-5 w-5 flex items-center justify-center ml-2 p-0">
                                          {unreadCount}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Aucune conversation {filter === 'unread' ? 'non lue' : ''} trouvée
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    
                    {/* Conversation */}
                    <div className="col-span-2 border rounded-lg overflow-hidden flex flex-col">
                      {selectedConversation ? (
                        <>
                          {/* En-tête de conversation */}
                          <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedConversation.with.avatar} />
                                <AvatarFallback>{selectedConversation.with.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h2 className="font-medium">{selectedConversation.with.name}</h2>
                                <p className="text-xs text-gray-500">{selectedConversation.with.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={
                                selectedConversation.with.role === 'host' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }>
                                {selectedConversation.with.role === 'host' ? 'Hôte' : 'Utilisateur'}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Messages */}
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                              {selectedConversation.messages.map((message) => (
                                <div 
                                  key={message.id}
                                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                  {message.sender !== 'admin' && (
                                    <Avatar className="h-8 w-8 mr-2 mt-1">
                                      <AvatarImage src={selectedConversation.with.avatar} />
                                      <AvatarFallback>{selectedConversation.with.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <div 
                                    className={`max-w-[70%] p-3 rounded-lg ${
                                      message.sender === 'admin' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                    }`}
                                  >
                                    <p>{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-gray-500'
                                    }`}>
                                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          
                          {/* Saisie de message */}
                          <div className="p-4 border-t">
                            <div className="flex gap-2">
                              <Textarea 
                                placeholder="Écrivez votre message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                  }
                                }}
                                className="min-h-[60px] resize-none"
                              />
                              <Button onClick={handleSendMessage} className="h-[60px]">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Aucune conversation sélectionnée</h3>
                            <p className="text-gray-500">
                              Sélectionnez une conversation pour afficher les messages.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
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
                        defaultValue="Bienvenue sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ce message sera envoyé automatiquement aux nouveaux utilisateurs lors de leur inscription.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => toast.success("Configuration sauvegardée")}>
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminMessages;
