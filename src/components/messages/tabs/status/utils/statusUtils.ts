
import { Status } from '../types';

/**
 * Formats time elapsed since the status was created
 * @param timestamp Date object or string of the status timestamp
 * @returns Formatted time elapsed string (e.g. "Il y a 5 min" or "Il y a 2 h")
 */
export const formatTimeElapsed = (timestamp: Date): string => {
  const now = new Date();
  const statusDate = new Date(timestamp);
  const diffMs = now.getTime() - statusDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours >= 1) {
    return `Il y a ${diffHours} h`;
  } else {
    return `Il y a ${diffMins} min`;
  }
};

/**
 * Checks if a status is expired (older than 24 hours)
 * @param timestamp The timestamp to check against
 * @returns boolean indicating if the status is expired
 */
export const isStatusExpired = (timestamp: Date): boolean => {
  const now = new Date();
  const statusDate = new Date(timestamp);
  const hoursDiff = (now.getTime() - statusDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff >= 24;
};

/**
 * Filters a list of statuses to remove expired ones
 * @param statuses Array of status objects
 * @returns Array of non-expired status objects
 */
export const filterExpiredStatuses = (statuses: Status[]): Status[] => {
  const now = new Date();
  return statuses.filter(status => {
    const statusDate = new Date(status.timestamp);
    const hoursDiff = (now.getTime() - statusDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24; // Keep statuses less than 24 hours old
  });
};

/**
 * Validates a text status
 * @param text Status text content
 * @returns boolean indicating if the status is valid
 */
export const isValidTextStatus = (text: string): boolean => {
  return text.trim().length > 0 && text.trim().length <= 280;
};

/**
 * Generates a unique ID for new statuses
 * @returns A numeric ID
 */
export const generateStatusId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Creates a new status object
 * @param content Optional text content
 * @param image Optional image URL
 * @param userData User data (name, avatar)
 * @returns A new Status object
 */
export const createNewStatus = (
  userData: { name: string; avatar: string },
  content?: string,
  image?: string
): Status => {
  return {
    id: generateStatusId(),
    user: userData.name,
    avatar: userData.avatar,
    isViewed: false,
    timestamp: new Date(),
    content,
    image
  };
};
