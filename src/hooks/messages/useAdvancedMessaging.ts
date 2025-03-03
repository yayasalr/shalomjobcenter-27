import { useState } from 'react';
import { Conversation, Message } from '@/components/messages/types';
import { toast } from 'sonner';

export const useAdvancedMessaging = (
  conversations: Conversation[],
  selectedConversation: Conversation | null,
  handleSendMessage: () => void,
  newMessage: string,
  setNewMessage: (message: string) => void
) => {
  // 1. Statut de connexion des utilisateurs (simulation)
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  // 2. Recherche avancée
  const [advancedSearchQuery, setAdvancedSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  // 3. Réponses rapides
  const [quickResponses, setQuickResponses] = useState<string[]>([
    "Merci pour votre message. Nous allons traiter votre demande dans les plus brefs délais.",
    "Bonjour, comment puis-je vous aider aujourd'hui?",
    "Pourriez-vous nous fournir plus de détails concernant votre demande?",
    "Votre demande a bien été prise en compte et sera traitée prochainement.",
    "N'hésitez pas à nous contacter pour toute information complémentaire."
  ]);
  
  // 4. Marquage d'importance
  const [markedImportant, setMarkedImportant] = useState<Record<string, boolean>>({});
  
  // 5. Aperçu des messages
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Simuler les utilisateurs en ligne
  useState(() => {
    // Simulation de connexion aléatoire des utilisateurs toutes les 30 secondes
    const interval = setInterval(() => {
      const newOnlineUsers: Record<string, boolean> = {};
      conversations.forEach(conv => {
        // 40% de chance d'être en ligne
        newOnlineUsers[conv.with.id] = Math.random() > 0.6;
      });
      setOnlineUsers(newOnlineUsers);
    }, 30000);
    
    // Initialisation
    const initialOnlineUsers: Record<string, boolean> = {};
    conversations.forEach(conv => {
      initialOnlineUsers[conv.with.id] = Math.random() > 0.6;
    });
    setOnlineUsers(initialOnlineUsers);
    
    return () => clearInterval(interval);
  });
  
  // Recherche avancée dans les messages
  const performAdvancedSearch = (query: string) => {
    if (!query.trim()) return [];
    
    const results: Array<{conversation: Conversation, message: Message}> = [];
    
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(query.toLowerCase())) {
          results.push({conversation: conv, message: msg});
        }
      });
    });
    
    return results;
  };
  
  // Appliquer une réponse rapide
  const applyQuickResponse = (responseText: string) => {
    setNewMessage(responseText);
    toast.success("Réponse rapide appliquée");
  };
  
  // Ajouter une nouvelle réponse rapide
  const addQuickResponse = (responseText: string) => {
    if (!responseText.trim()) return;
    
    setQuickResponses(prev => [...prev, responseText]);
    toast.success("Réponse rapide ajoutée");
  };
  
  // Supprimer une réponse rapide
  const removeQuickResponse = (index: number) => {
    setQuickResponses(prev => prev.filter((_, i) => i !== index));
    toast.success("Réponse rapide supprimée");
  };
  
  // Marquer/démarquer une conversation comme importante
  const toggleImportant = (conversationId: string) => {
    setMarkedImportant(prev => ({
      ...prev,
      [conversationId]: !prev[conversationId]
    }));
    
    toast.success(
      markedImportant[conversationId] 
        ? "Conversation marquée comme normale" 
        : "Conversation marquée comme importante"
    );
  };
  
  // Prévisualiser avant d'envoyer
  const previewMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Le message est vide");
      return;
    }
    
    setIsPreviewMode(true);
    toast.info("Mode aperçu activé - Vérifiez votre message avant l'envoi");
  };
  
  // Envoyer depuis le mode aperçu
  const sendFromPreview = () => {
    setIsPreviewMode(false);
    handleSendMessage();
    toast.success("Message envoyé");
  };
  
  // Annuler l'aperçu
  const cancelPreview = () => {
    setIsPreviewMode(false);
    toast.info("Aperçu annulé");
  };
  
  return {
    // 1. Statut de connexion
    onlineUsers,
    
    // 2. Recherche avancée
    advancedSearchQuery,
    setAdvancedSearchQuery,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    performAdvancedSearch,
    
    // 3. Réponses rapides
    quickResponses,
    applyQuickResponse,
    addQuickResponse,
    removeQuickResponse,
    
    // 4. Marquage d'importance
    markedImportant,
    toggleImportant,
    
    // 5. Aperçu des messages
    isPreviewMode,
    previewMessage,
    sendFromPreview,
    cancelPreview
  };
};
