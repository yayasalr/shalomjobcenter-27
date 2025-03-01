
import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';

export const useMessageSender = (
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  selectedConversation: Conversation | null,
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
) => {
  const [newMessage, setNewMessage] = useState('');

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !userId) return;
    
    // Créer le nouveau message
    const updatedMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      read: true,
      sender: 'user',
    };
    
    // Mettre à jour la conversation sélectionnée et la liste des conversations
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp: new Date(),
        read: true,
        sender: 'user' as const,
      },
    };
    
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedSelectedConversation);
    
    // Sauvegarder dans localStorage pour persister les changements
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    
    // Réinitialiser le champ de message
    setNewMessage('');
    
    // Pour les conversations avec admin ou bot d'accueil, mettre à jour aussi leur côté
    if (selectedConversation.with.id === 'admin' || selectedConversation.with.id === 'welcome-bot') {
      setTimeout(() => {
        const autoResponseSender = selectedConversation.with.id === 'admin' ? 'admin' : 'system';
        const autoResponse: Message = {
          id: `auto-${Date.now()}`,
          content: selectedConversation.with.id === 'admin' 
            ? "Merci pour votre message. Je reviendrai vers vous dès que possible."
            : "Merci de votre intérêt pour nos services. Notre équipe est là pour vous aider !",
          timestamp: new Date(),
          read: false,
          sender: autoResponseSender,
        };
        
        // Ajouter la réponse automatique à la conversation locale
        const convWithResponse = {
          ...updatedSelectedConversation,
          messages: [...updatedSelectedConversation.messages, autoResponse],
          lastMessage: {
            content: autoResponse.content,
            timestamp: autoResponse.timestamp,
            read: false,
            sender: autoResponseSender,
          },
        };
        
        // Mettre à jour l'état local
        const finalConversations = updatedConversations.map(conv => 
          conv.id === selectedConversation.id ? convWithResponse : conv
        );
        
        setConversations(finalConversations);
        setSelectedConversation(convWithResponse);
        
        // Mettre à jour dans localStorage
        localStorage.setItem(`conversations_${userId}`, JSON.stringify(finalConversations));
        
        // Si c'est l'admin, mettre à jour également le localStorage côté admin
        if (selectedConversation.with.id === 'admin') {
          try {
            // Récupération des données utilisateur
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = users.find((u: any) => u.id === userId);
            
            if (currentUser) {
              // Mettre à jour la conversation admin dans le stockage admin
              updateAdminConversation(userId, updatedMessage, autoResponse, currentUser);
            }
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la conversation admin:", error);
          }
        }
        
        toast.success("Nouveau message reçu");
      }, Math.random() * 2000 + 1000); // Entre 1 et 3 secondes
    }
  };

  // Fonction d'aide pour mettre à jour la conversation côté admin
  const updateAdminConversation = (
    userId: string, 
    userMessage: Message, 
    adminResponse: Message,
    userData: any
  ) => {
    // Charger toutes les conversations admin
    const adminConversations = loadAdminConversations();
    
    // Rechercher la conversation avec cet utilisateur
    const adminConvIndex = adminConversations.findIndex(conv => 
      conv.with.id === userId
    );
    
    if (adminConvIndex >= 0) {
      // Mettre à jour la conversation existante
      const updatedAdminConv = {
        ...adminConversations[adminConvIndex],
        messages: [
          ...adminConversations[adminConvIndex].messages,
          // Ajouter le message utilisateur et la réponse admin
          {
            ...userMessage,
            read: false,  // Non lu par l'admin
            sender: 'user' as const,
          },
          {
            ...adminResponse,
            read: true,   // Lu par l'admin qui l'a envoyé
            sender: 'admin' as const,
          }
        ],
        lastMessage: {
          content: adminResponse.content,
          timestamp: adminResponse.timestamp,
          read: true,
          sender: 'admin' as const,
        },
      };
      
      adminConversations[adminConvIndex] = updatedAdminConv;
    } else {
      // Créer une nouvelle conversation admin si elle n'existe pas encore
      adminConversations.push({
        id: `admin-${userId}`,
        with: {
          id: userId,
          name: userData.name || 'Utilisateur inconnu',
          email: userData.email || '',
          avatar: userData.avatar || '/placeholder.svg',
          role: userData.role || 'user',
        },
        messages: [
          {
            ...userMessage,
            read: false,
            sender: 'user' as const,
          },
          {
            ...adminResponse,
            read: true,
            sender: 'admin' as const,
          }
        ],
        lastMessage: {
          content: adminResponse.content,
          timestamp: adminResponse.timestamp,
          read: true,
          sender: 'admin' as const,
        },
      });
    }
    
    // Sauvegarder les conversations admin mises à jour dans localStorage
    // On simule ici que ces conversations sont stockées comme dans la vraie implémentation
    localStorage.setItem('admin_conversations', JSON.stringify(adminConversations));
  };

  // Fonction d'aide pour charger les conversations admin
  const loadAdminConversations = (): Conversation[] => {
    try {
      return JSON.parse(localStorage.getItem('admin_conversations') || '[]', (k, v) => {
        if (k === 'timestamp' && typeof v === 'string') {
          return new Date(v);
        }
        return v;
      });
    } catch (error) {
      console.error("Erreur lors du chargement des conversations admin:", error);
      return [];
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage
  };
};
