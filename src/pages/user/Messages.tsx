
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

// Types pour les données
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other' | 'admin' | 'system';
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    avatar?: string;
    role?: 'user' | 'host' | 'admin';
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    read: boolean;
    sender: 'user' | 'other' | 'admin' | 'system';
  };
  messages: Message[];
}

const ADMIN_USER = {
  id: 'admin',
  name: 'Administrateur',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

const WELCOME_BOT = {
  id: 'welcome-bot',
  name: 'SHALOM JOB CENTER',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Charger les conversations depuis le localStorage
  useEffect(() => {
    if (user) {
      const savedConversations = localStorage.getItem(`conversations_${user.id}`);
      
      if (savedConversations) {
        try {
          // Conversion des chaînes de date en objets Date
          const parsedConversations = JSON.parse(savedConversations, (key, value) => {
            if (key === 'timestamp' && typeof value === 'string') {
              return new Date(value);
            }
            return value;
          });
          
          setConversations(parsedConversations);
          
          if (parsedConversations.length > 0) {
            setSelectedConversation(parsedConversations[0]);
          }
        } catch (error) {
          console.error("Erreur lors de la lecture des conversations:", error);
          initializeDefaultConversations();
        }
      } else {
        // Aucune conversation trouvée, initialiser avec les conversations par défaut
        initializeDefaultConversations();
      }
    }
  }, [user]);

  // Enregistrer les conversations dans le localStorage lorsqu'elles changent
  useEffect(() => {
    if (user && conversations.length > 0) {
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);

  // Initialiser les conversations par défaut pour un nouvel utilisateur
  const initializeDefaultConversations = () => {
    if (!user) return;

    // Créer la conversation de bienvenue avec le bot
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: `Bienvenue ${user.name} sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance.`,
      sender: 'system',
      timestamp: new Date(),
      read: false,
    };

    // Créer la conversation avec l'administrateur
    const adminWelcomeMessage: Message = {
      id: `admin-welcome-${Date.now()}`,
      content: `Bonjour ${user.name}, je suis l'administrateur de la plateforme. N'hésitez pas à me contacter si vous avez des questions.`,
      sender: 'admin',
      timestamp: new Date(),
      read: false,
    };

    const initialConversations: Conversation[] = [
      {
        id: `welcome-${Date.now()}`,
        with: WELCOME_BOT,
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: welcomeMessage.read,
          sender: 'system',
        },
        messages: [welcomeMessage],
      },
      {
        id: `admin-${Date.now()}`,
        with: ADMIN_USER,
        lastMessage: {
          content: adminWelcomeMessage.content,
          timestamp: adminWelcomeMessage.timestamp,
          read: adminWelcomeMessage.read,
          sender: 'admin',
        },
        messages: [adminWelcomeMessage],
      }
    ];

    setConversations(initialConversations);
    setSelectedConversation(initialConversations[0]);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    
    const updatedMessage: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, updatedMessage],
          lastMessage: {
            content: newMessage,
            timestamp: new Date(),
            read: true,
            sender: 'user',
          },
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, updatedMessage],
        lastMessage: {
          content: newMessage,
          timestamp: new Date(),
          read: true,
          sender: 'user',
        },
      };
    });
    
    setNewMessage('');
    
    // Simuler une réponse automatique après 1-3 secondes
    if (selectedConversation.with.id === 'admin' || selectedConversation.with.id === 'welcome-bot') {
      setTimeout(() => {
        const autoResponse: Message = {
          id: `auto-${Date.now()}`,
          content: selectedConversation.with.id === 'admin' 
            ? "Merci pour votre message. Je reviendrai vers vous dès que possible."
            : "Merci de votre intérêt pour nos services. Notre équipe est là pour vous aider !",
          sender: selectedConversation.with.id === 'admin' ? 'admin' : 'system',
          timestamp: new Date(),
          read: false,
        };
        
        const updatedWithResponse = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [...conv.messages, autoResponse],
              lastMessage: {
                content: autoResponse.content,
                timestamp: autoResponse.timestamp,
                read: autoResponse.read,
                sender: autoResponse.sender,
              },
            };
          }
          return conv;
        });
        
        setConversations(updatedWithResponse);
        setSelectedConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, autoResponse],
            lastMessage: {
              content: autoResponse.content,
              timestamp: autoResponse.timestamp,
              read: autoResponse.read,
              sender: autoResponse.sender,
            },
          };
        });
        
        toast.success("Nouveau message reçu");
      }, Math.random() * 2000 + 1000); // Entre 1 et 3 secondes
    }
  };

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(conv => 
    conv.with.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  const handleSelectConversation = (conversation: Conversation) => {
    // Marquer tous les messages comme lus
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id && !conv.lastMessage.read) {
        const updatedMessages = conv.messages.map(msg => ({
          ...msg,
          read: true
        }));
        
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: {
            ...conv.lastMessage,
            read: true
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  // Compter les messages non lus
  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => !msg.read && (msg.sender === 'other' || msg.sender === 'admin' || msg.sender === 'system')).length;
  };

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-md mx-auto mt-12">
            <CardContent className="p-6 text-center">
              <Info className="w-12 h-12 mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connectez-vous pour accéder à la messagerie</h2>
              <p className="text-gray-600 mb-4">
                Pour envoyer et recevoir des messages, vous devez vous connecter à votre compte.
              </p>
              <Button asChild className="mt-4 w-full">
                <a href="/login">Se connecter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Messages</h1>
        
        <Card className="h-[calc(80vh-8rem)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Liste des conversations */}
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-9" 
                    placeholder="Rechercher dans les messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(80vh-16rem)]">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const unreadCount = getUnreadCount(conversation);
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                          selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={conversation.with.avatar} />
                              <AvatarFallback className={
                                conversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
                              }>
                                {conversation.with.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.with.role === 'admin' && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-medium truncate flex items-center">
                                {conversation.with.name}
                                {conversation.with.role === 'admin' && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Admin</Badge>
                                )}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <p className={`text-sm truncate ${
                                !conversation.lastMessage.read && conversation.lastMessage.sender !== 'user' 
                                  ? 'font-medium' 
                                  : 'text-gray-500'
                              }`}>
                                {conversation.lastMessage.sender === 'user' ? 'Vous: ' : ''}
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
                    Aucune conversation trouvée
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Conversation */}
            {selectedConversation ? (
              <div className="col-span-2 flex flex-col h-full">
                {/* En-tête de conversation */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.with.avatar} />
                      <AvatarFallback className={
                        selectedConversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
                      }>
                        {selectedConversation.with.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h2 className="font-medium">{selectedConversation.with.name}</h2>
                        {selectedConversation.with.role === 'admin' && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Admin</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.with.id === 'admin' 
                          ? 'Administrateur de la plateforme' 
                          : 'En ligne il y a 2h'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender !== 'user' && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={selectedConversation.with.avatar} />
                            <AvatarFallback className={
                              selectedConversation.with.role === 'admin' ? 'bg-blue-500 text-white' : ''
                            }>
                              {selectedConversation.with.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-primary text-white rounded-tr-none' 
                              : message.sender === 'admin'
                                ? 'bg-blue-100 text-blue-800 rounded-tl-none'
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' 
                              ? 'text-primary-foreground/70' 
                              : message.sender === 'admin'
                                ? 'text-blue-700'
                                : 'text-gray-500'
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
              </div>
            ) : (
              <div className="col-span-2 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-gray-500">
                    Sélectionnez une conversation pour afficher les messages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
