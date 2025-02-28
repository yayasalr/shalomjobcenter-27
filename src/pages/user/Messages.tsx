
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

// Types pour simuler les données
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    read: boolean;
  };
  messages: Message[];
}

const Messages = () => {
  // Conversations simulées
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      with: {
        id: '101',
        name: 'Sophie Martin',
        avatar: '/placeholder.svg',
      },
      lastMessage: {
        content: 'D\'accord, je vous y retrouverai à 14h demain.',
        timestamp: new Date(Date.now() - 3600000), // 1 heure
        read: true,
      },
      messages: [
        {
          id: 'm1',
          content: 'Bonjour, je suis intéressé par votre appartement.',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000 * 2), // 2 jours
        },
        {
          id: 'm2',
          content: 'Bonjour ! Je serais ravi de vous le faire visiter.',
          sender: 'other',
          timestamp: new Date(Date.now() - 86400000), // 1 jour
        },
        {
          id: 'm3',
          content: 'Pourrions-nous organiser une visite demain après-midi ?',
          sender: 'user',
          timestamp: new Date(Date.now() - 43200000), // 12 heures
        },
        {
          id: 'm4',
          content: 'Oui, je suis disponible demain à 14h. Cela vous convient-il ?',
          sender: 'other',
          timestamp: new Date(Date.now() - 7200000), // 2 heures
        },
        {
          id: 'm5',
          content: 'D\'accord, je vous y retrouverai à 14h demain.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000), // 1 heure
        },
      ],
    },
    {
      id: '2',
      with: {
        id: '102',
        name: 'Thomas Dubois',
        avatar: '/placeholder.svg',
      },
      lastMessage: {
        content: 'Le logement est-il toujours disponible ?',
        timestamp: new Date(Date.now() - 86400000), // 1 jour
        read: false,
      },
      messages: [
        {
          id: 'm1',
          content: 'Bonjour, je suis intéressé par votre logement à Lomé.',
          sender: 'other',
          timestamp: new Date(Date.now() - 172800000), // 2 jours
        },
        {
          id: 'm2',
          content: 'Le logement est-il toujours disponible ?',
          sender: 'other',
          timestamp: new Date(Date.now() - 86400000), // 1 jour
        },
      ],
    },
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedMessage: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
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
        },
      };
    });
    setNewMessage('');
  };

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
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(80vh-16rem)]">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
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
                        <p className={`text-sm truncate ${
                          !conversation.lastMessage.read ? 'font-medium' : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      {!conversation.lastMessage.read && (
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
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
                      <AvatarFallback>{selectedConversation.with.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{selectedConversation.with.name}</h2>
                      <p className="text-xs text-gray-500">En ligne il y a 2h</p>
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
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-900 rounded-tl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
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
                    <Input 
                      placeholder="Écrivez votre message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
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
