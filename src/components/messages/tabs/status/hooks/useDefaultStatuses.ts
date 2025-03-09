
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';

/**
 * Generates default statuses for demo purposes
 * @returns An array of demo Status objects
 */
export const useDefaultStatuses = (): Status[] => {
  const { saveData } = useLocalStorage();
  const now = new Date();
  
  const defaultStatuses: Status[] = [
    {
      id: 1001,
      user: "Marie Dupont",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      content: "Bonjour à tous! Notre nouvelle politique de sécurité est maintenant disponible sur le portail.",
      image: "/placeholder.svg" // Add default image
    },
    {
      id: 1002,
      user: "Thomas Martin",
      avatar: "/placeholder.svg",
      isViewed: true,
      timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 1003,
      user: "Sophie Bernard",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 240), // 3 hours ago
      content: "Vacances en Italie! 🌞🍕",
      image: "/placeholder.svg"
    },
    {
      id: 1004,
      user: "Thomas Lefebvre",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 240), // 4 hours ago
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
    }
  ];
  
  // Save to local storage
  saveData('user-statuses', defaultStatuses);
  
  return defaultStatuses;
};
