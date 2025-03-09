
import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { StatusMessage } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useStatusManagement = () => {
  const { toast } = useToast();
  const { loadData, saveData } = useLocalStorage();
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  // Load status messages on component mount
  useEffect(() => {
    try {
      const rawData = loadData<any>('admin-status-messages', []);
      let processedMessages: StatusMessage[] = [];
      
      if (Array.isArray(rawData)) {
        // Check if it's already a flat array of StatusMessage objects
        if (rawData.length === 0 || (rawData.length > 0 && typeof rawData[0] === 'object' && rawData[0] !== null && 'id' in rawData[0])) {
          processedMessages = rawData as StatusMessage[];
        } 
        // Check if it's a nested array and flatten it
        else if (rawData.length > 0 && Array.isArray(rawData[0])) {
          const flattened = (rawData as any[]).flat();
          if (flattened.length > 0 && typeof flattened[0] === 'object' && flattened[0] !== null && 'id' in flattened[0]) {
            processedMessages = flattened as StatusMessage[];
          }
        }
      }
      
      // Filter out expired status messages (older than 24 hours)
      const now = new Date();
      const validMessages = processedMessages.filter(msg => {
        const messageDate = new Date(msg.createdAt);
        const hoursDiff = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });
      
      setStatusMessages(validMessages);
      
      // If we fixed the data format or filtered expired messages, save it back properly
      if (JSON.stringify(rawData) !== JSON.stringify(validMessages)) {
        saveData('admin-status-messages', validMessages);
      }
      
      // Also save to user-statuses for the messaging interface
      const userStatusFormat = validMessages.map(msg => ({
        id: Number(msg.id),
        user: "Admin",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(msg.createdAt),
        content: msg.text,
        image: msg.imageUrl
      }));
      
      const existingUserStatuses = loadData('user-statuses', []);
      
      // Merge with existing user statuses
      const combinedStatuses = [...userStatusFormat, ...existingUserStatuses];
      
      // Remove duplicates based on id
      const uniqueStatuses = combinedStatuses.filter((status, index, self) =>
        index === self.findIndex(s => s.id === status.id)
      );
      
      saveData('user-statuses', uniqueStatuses);
      
    } catch (error) {
      console.error('Error loading status messages:', error);
      setStatusMessages([]);
    }
  }, [loadData, saveData]);

  // Save status messages when they change
  useEffect(() => {
    if (statusMessages.length > 0) {
      saveData('admin-status-messages', statusMessages);
      
      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('storage'));
    }
  }, [statusMessages, saveData]);

  const handlePublish = (newStatusData: Omit<StatusMessage, 'id' | 'createdAt' | 'active'>) => {
    if (!newStatusData.text.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir un texte pour le statut",
        variant: "destructive"
      });
      return;
    }

    const newStatus: StatusMessage = {
      id: Date.now().toString(),
      text: newStatusData.text.trim(),
      imageUrl: newStatusData.imageUrl,
      createdAt: new Date().toISOString(),
      active: true,
      type: newStatusData.type,
      backgroundColor: newStatusData.backgroundColor,
      textColor: newStatusData.textColor
    };

    setStatusMessages([newStatus, ...statusMessages]);
    
    toast({
      title: "Statut publié",
      description: "Votre statut a été publié avec succès et sera visible pendant 24 heures"
    });
    
    // Also save to user-statuses for the messaging interface
    const userStatus = {
      id: Number(newStatus.id),
      user: "Admin",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(newStatus.createdAt),
      content: newStatus.text,
      image: newStatus.imageUrl
    };
    
    const existingUserStatuses = loadData('user-statuses', []);
    saveData('user-statuses', [userStatus, ...existingUserStatuses]);
    
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const toggleStatusActive = (id: string) => {
    setStatusMessages(
      statusMessages.map(status => 
        status.id === id ? { ...status, active: !status.active } : status
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: "Le statut a été mis à jour avec succès"
    });
  };

  const deleteStatus = (id: string) => {
    setStatusMessages(statusMessages.filter(status => status.id !== id));
    
    // Also remove from user-statuses
    const existingUserStatuses = loadData('user-statuses', []);
    const updatedUserStatuses = existingUserStatuses.filter((status: any) => status.id !== Number(id));
    saveData('user-statuses', updatedUserStatuses);
    
    toast({
      title: "Statut supprimé",
      description: "Le statut a été supprimé avec succès"
    });
    
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  return {
    statusMessages,
    handlePublish,
    toggleStatusActive,
    deleteStatus
  };
};
