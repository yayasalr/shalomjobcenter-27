
import { Status } from '../types';

/**
 * Filters out status messages older than 24 hours
 */
export const filterExpiredStatuses = (statuses: Status[]): Status[] => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return statuses.filter(status => {
    // Ensure status.timestamp is a Date object
    const timestamp = status.timestamp instanceof Date 
      ? status.timestamp 
      : new Date(status.timestamp);
    
    return timestamp > yesterday;
  });
};

/**
 * Formats the time elapsed since the status was posted
 */
export const formatTimeElapsed = (timestamp: Date | string): string => {
  // Ensure timestamp is a Date object
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  
  // Calculate time difference in milliseconds
  const diff = now.getTime() - date.getTime();
  
  // Convert to minutes, hours, days
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? 'hier' : `il y a ${days} jours`;
  } else if (hours > 0) {
    return `il y a ${hours}h`;
  } else if (minutes > 0) {
    return `il y a ${minutes} min`;
  } else {
    return 'à l\'instant';
  }
};

/**
 * Formats a timestamp into a consistent time string
 */
export const formatStatusTime = (timestamp: Date | string): string => {
  // Ensure timestamp is a Date object
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Format as HH:MM
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

/**
 * Gets view count for a status
 */
export const getStatusViewCount = (statusId: number): number => {
  try {
    const viewersData = localStorage.getItem(`status-viewers-${statusId}`);
    if (!viewersData) return 0;
    
    const viewers = JSON.parse(viewersData);
    return Array.isArray(viewers) ? viewers.length : 0;
  } catch (error) {
    console.error('Error getting view count:', error);
    return 0;
  }
};

/**
 * Gets viewers list for a status
 */
export const getStatusViewers = (statusId: number): any[] => {
  try {
    const viewersData = localStorage.getItem(`status-viewers-${statusId}`);
    if (!viewersData) return [];
    
    const viewers = JSON.parse(viewersData);
    return Array.isArray(viewers) ? viewers : [];
  } catch (error) {
    console.error('Error getting viewers:', error);
    return [];
  }
};
