
const useLocalStorage = () => {
  const loadData = <T>(key: string, defaultData: T[]): T[] => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData);
    }
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  };

  const saveData = <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  return {
    loadData,
    saveData
  };
};

export default useLocalStorage;
