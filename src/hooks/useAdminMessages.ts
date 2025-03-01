
import { useState, useEffect } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';

export const useAdminMessages = () => {
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
          const adminConvs = userConversations.filter((conv: any) => 
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
                  // Inverser le sender et s'assurer qu'il est du bon type
                  sender: adminConv.lastMessage.sender === 'user' ? 'user' : 'admin',
                },
                messages: adminConv.messages.map(msg => ({
                  ...msg,
                  // Inverser le sender et s'assurer qu'il est du bon type
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
      const updatedUserConversations = userConversations.map((conv: any) => {
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
    const updatedSelectedConversation: Conversation = {
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
    const updatedConversations: Conversation[] = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    setNewMessage('');
    
    // Mettre à jour la conversation de l'utilisateur dans le localStorage
    updateUserConversation(selectedConversation.with.id, updatedSelectedConversation);
    
    toast.success("Message envoyé avec succès");
  };

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  const handleSelectConversation = (conversation: Conversation) => {
    // Marquer tous les messages utilisateur comme lus
    const updatedMessages = conversation.messages.map(msg => ({
      ...msg,
      read: true
    }));
    
    const updatedConversation: Conversation = {
      ...conversation,
      messages: updatedMessages,
      lastMessage: {
        ...conversation.lastMessage,
        read: true
      }
    };
    
    // Mettre à jour l'état des conversations
    const updatedConversations: Conversation[] = conversations.map(conv => 
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

  return {
    conversations,
    selectedConversation,
    newMessage,
    searchQuery,
    filter,
    totalUnreadCount,
    setNewMessage,
    setSearchQuery,
    setFilter,
    handleSendMessage,
    handleSelectConversation,
    getUnreadCount
  };
};
