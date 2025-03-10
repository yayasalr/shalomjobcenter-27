
import { purgeAllReservations } from "@/hooks/reservations/demoData";
import { loadReservations, saveReservations } from "@/hooks/reservations/storage";
import { toast } from "sonner";

/**
 * Purge toutes les données de démonstration de l'application
 * pour préparer le déploiement avec des utilisateurs réels
 */
export const purgeAllDemoData = () => {
  try {
    // Purger les réservations
    purgeAllReservations();
    
    // Purger les jobs/offres d'emploi
    localStorage.removeItem('jobs');
    
    // Purger les paiements de démonstration
    localStorage.removeItem('payments');
    
    // Purger les avis/reviews
    localStorage.removeItem('reviews');
    
    // Purger toute autre donnée de démo stockée dans localStorage
    const keysToKeep = ['user', 'token', 'settings']; // Garder les données essentielles
    
    // Identifier les clés à supprimer
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    // Supprimer les clés identifiées
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log("Toutes les données de démonstration ont été purgées avec succès");
    toast.success("Toutes les données de démonstration ont été supprimées");
    return true;
  } catch (error) {
    console.error("Erreur lors de la purge des données:", error);
    toast.error("Erreur lors de la suppression des données");
    return false;
  }
};
