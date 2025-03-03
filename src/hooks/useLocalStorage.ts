
const useLocalStorage = () => {
  const loadData = <T>(key: string, defaultData: T[]): T[] => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        return JSON.parse(savedData);
      }
      // Save default data immediately
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    } catch (error) {
      console.error(`Erreur lors du chargement des données pour ${key}:`, error);
      return defaultData;
    }
  };

  const saveData = <T>(key: string, data: T[]): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde des données pour ${key}:`, error);
      return false;
    }
  };

  // New method to get a single item
  const getItem = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return defaultValue;
    }
  };

  // New method to set a single item
  const setItem = <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key}:`, error);
      return false;
    }
  };

  // New method to remove an item
  const removeItem = (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  };

  return {
    loadData,
    saveData,
    getItem,
    setItem,
    removeItem
  };
};

export default useLocalStorage;
