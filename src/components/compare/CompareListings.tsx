
import React, { useState, useEffect } from 'react';
import { useListings } from '@/hooks/useListings';
import { ComparePanel } from './ComparePanel';

export const CompareListings = () => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { listings } = useListings();
  const [compareListings, setCompareListings] = useState<any[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedIds = localStorage.getItem('compareListings');
      if (storedIds) {
        try {
          const ids = JSON.parse(storedIds);
          setCompareIds(ids);
          setIsVisible(ids.length > 0);
        } catch (e) {
          console.error("Erreur lors de la récupération des logements à comparer:", e);
        }
      } else {
        setCompareIds([]);
        setIsVisible(false);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!listings || compareIds.length === 0) {
      setCompareListings([]);
      return;
    }

    const filteredListings = listings.filter(listing => compareIds.includes(listing.id));
    setCompareListings(filteredListings);
  }, [listings, compareIds]);

  const removeListing = (id: string) => {
    const updatedIds = compareIds.filter(compareId => compareId !== id);
    localStorage.setItem('compareListings', JSON.stringify(updatedIds));
    
    setCompareIds(updatedIds);
    
    if (updatedIds.length === 0) {
      setIsVisible(false);
    }
    
    window.dispatchEvent(new Event('storage'));
  };

  const clearComparison = () => {
    localStorage.removeItem('compareListings');
    setCompareIds([]);
    setIsVisible(false);
    window.dispatchEvent(new Event('storage'));
  };

  if (!isVisible) return null;

  return (
    <ComparePanel 
      compareListings={compareListings}
      removeListing={removeListing}
      clearComparison={clearComparison}
    />
  );
};
