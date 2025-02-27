
import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { toast } from 'sonner';

interface CompareButtonProps {
  listingId: string;
}

export const CompareButton = ({ listingId }: CompareButtonProps) => {
  const [isComparing, setIsComparing] = useState(false);
  
  // Vérifier si le logement est déjà en cours de comparaison
  useEffect(() => {
    const checkIfComparing = () => {
      const compareIds = localStorage.getItem('compareListings');
      if (compareIds) {
        try {
          const ids = JSON.parse(compareIds);
          setIsComparing(ids.includes(listingId));
        } catch (e) {
          console.error("Erreur lors de la vérification des logements à comparer:", e);
        }
      }
    };
    
    checkIfComparing();
    
    // Écouter les changements dans le localStorage
    window.addEventListener('storage', checkIfComparing);
    return () => {
      window.removeEventListener('storage', checkIfComparing);
    };
  }, [listingId]);
  
  // Fonction pour ajouter/retirer un logement de la comparaison
  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let compareIds: string[] = [];
    const storedIds = localStorage.getItem('compareListings');
    
    if (storedIds) {
      try {
        compareIds = JSON.parse(storedIds);
      } catch (e) {
        console.error("Erreur lors du parsing des logements à comparer:", e);
      }
    }
    
    if (isComparing) {
      // Retirer de la comparaison
      compareIds = compareIds.filter(id => id !== listingId);
      toast.success("Retiré de la comparaison");
    } else {
      // Ajouter à la comparaison (maximum 4)
      if (compareIds.length >= 4) {
        toast.error("Vous ne pouvez comparer que 4 logements maximum");
        return;
      }
      
      compareIds.push(listingId);
      toast.success("Ajouté à la comparaison");
    }
    
    localStorage.setItem('compareListings', JSON.stringify(compareIds));
    setIsComparing(!isComparing);
    
    // Déclencher un événement pour que les autres composants puissent réagir
    window.dispatchEvent(new Event('storage'));
  };
  
  return (
    <button
      className={`flex items-center justify-center p-2 rounded-full ${
        isComparing ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border'
      }`}
      onClick={toggleCompare}
      title={isComparing ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
    >
      <Scale className="h-4 w-4" />
    </button>
  );
};
