
import { Status } from '../types';
import useLocalStorage from '@/hooks/useLocalStorage';

/**
 * Loads all statuses from various sources in local storage
 * @returns An array of valid Status objects
 */
export const useStatusData = (): Status[] => {
  const { loadData } = useLocalStorage();
  
  // Load user statuses
  const storedData = loadData<unknown>('user-statuses', []);
  let processedStatuses: Status[] = [];
  
  if (Array.isArray(storedData)) {
    // Handle only valid Status objects
    processedStatuses = storedData.filter((item): item is Status => 
      item !== null && 
      typeof item === 'object' && 
      'id' in item &&
      'user' in item &&
      'avatar' in item &&
      'isViewed' in item &&
      'timestamp' in item
    );
  }
  
  // Load admin status messages if available
  const adminStatusMessages = loadData<unknown>('admin-status-messages', []);
  if (Array.isArray(adminStatusMessages) && adminStatusMessages.length > 0) {
    // Convert admin status messages to user status format
    const adminStatuses: Status[] = adminStatusMessages
      .filter((msg): msg is Record<string, unknown> => 
        msg !== null && 
        typeof msg === 'object' && 
        'id' in msg
      )
      .map((msg): Status => ({
        id: Number(msg.id),
        user: "Admin",
        avatar: "/placeholder.svg",
        isViewed: false,
        timestamp: new Date(msg.createdAt as string || Date.now()),
        content: msg.text as string,
        image: msg.imageUrl as string | undefined
      }));
    
    processedStatuses = [...processedStatuses, ...adminStatuses];
  }
  
  // Try to load statuses from individual users
  const usersList = loadData<unknown>('users', []);
  if (Array.isArray(usersList)) {
    for (const user of usersList) {
      if (user !== null && typeof user === 'object' && 'id' in user) {
        const userStatusKey = `status_${user.id}`;
        const userStatuses = loadData<unknown>(userStatusKey, []);
        if (Array.isArray(userStatuses) && userStatuses.length > 0) {
          // Only add valid status objects
          const validUserStatuses = userStatuses.filter((status): status is Status => 
            status !== null && 
            typeof status === 'object' && 
            'id' in status &&
            'user' in status &&
            'avatar' in status &&
            'isViewed' in status &&
            'timestamp' in status
          );
          
          if (validUserStatuses.length > 0) {
            processedStatuses = [...processedStatuses, ...validUserStatuses];
          }
        }
      }
    }
  }
  
  return processedStatuses;
};
