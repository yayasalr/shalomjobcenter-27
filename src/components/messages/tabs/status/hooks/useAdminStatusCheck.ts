
import { useEffect } from 'react';

/**
 * Hook to check if on admin page and trigger a callback if so
 * @param callback Function to call if on admin page
 */
export const useAdminStatusCheck = (callback: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      callback();
    }
  }, dependencies);
};
