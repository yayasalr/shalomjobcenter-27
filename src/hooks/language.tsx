
import React, { createContext, useContext, ReactNode } from 'react';

// Simple context that provides French text directly
interface LanguageContextType {
  t: (key: string) => string;
  language: 'fr';
  setLanguage: (lang: 'fr') => void;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key,
  language: 'fr',
  setLanguage: () => {}
});

// Hook for components to use
export const useLanguage = () => useContext(LanguageContext);

// Hook for provider to use
export const useLanguageProvider = () => {
  // Always return French since we're simplifying
  const language = 'fr' as const;
  
  // Translation function (returns hard-coded French text)
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      // Common translations
      'name': 'Nom',
      'email': 'Email',
      'phone': 'Téléphone',
      'details': 'Détails',
      'cancel': 'Annuler',
      'like': 'J\'aime',
      'comment': 'Commenter',
      'share': 'Partager',
      'accept': 'Accepter',
      'reject': 'Rejeter',
      'find_housing': 'Trouver un logement',
      'job_offers': 'Offres d\'emploi',
      'night': 'nuit',
      'reviews': 'avis',
      'service_fee': 'Frais de service',
      'total': 'Total',
      'book': 'Réserver',
      'processing': 'Traitement en cours...',
      'add_to_favorites': 'Ajouter aux favoris',
      'remove_from_favorites': 'Retirer des favoris',
      'travelers': 'VOYAGEURS',
      'traveler': 'voyageur',
      
      // Hero section
      'discover_home': 'Découvrez votre chez-vous',
      'hero_housing_desc': 'Logements premium dans les meilleurs quartiers de Lomé pour une expérience de vie supérieure.',
      'verified_housing': 'Logements vérifiés',
      'secure_payments': 'Paiements sécurisés',
      'local_support': 'Support local',
      'popular_neighborhoods': 'Quartiers populaires',
      
      // Features
      'features_title': 'Votre expérience de logement supérieure',
      'features_subtitle': 'Des logements de qualité avec des services exceptionnels',
      'secure_payment': 'Paiement sécurisé',
      'secure_payment_desc': 'Transactions protégées par cryptage avancé',
      'premium_housing': 'Logements premium',
      'premium_housing_desc': 'Sélectionnés pour leur qualité et confort',
      'quality_verified': 'Qualité vérifiée',
      'quality_verified_desc': 'Tous nos logements sont inspectés',
      'prime_locations': 'Emplacements privilégiés',
      'prime_locations_desc': 'Dans les meilleurs quartiers de Lomé',
      '24_7_support': 'Support 24/7',
      '24_7_support_desc': 'Notre équipe est toujours disponible',
      'satisfaction_guarantee': 'Satisfaction garantie',
      'satisfaction_guarantee_desc': 'Votre satisfaction est notre priorité',
      
      // Jobs
      'find_your_career': 'Trouvez votre',
      'career': 'carrière',
      'professional_opportunities': 'Opportunités professionnelles avec logement inclus',
      'filter_offers': 'Filtrer les offres',
      'view_housing': 'Voir les logements',
      'stable_careers': 'Carrières stables',
      'housing_included': 'Logement inclus',
      'continuous_training': 'Formation continue',
      'security_jobs': 'Emplois de sécurité',
      'premium_security_agent': 'Agent de sécurité premium',
      'starting_today': 'Démarrage immédiat',
      'filter_by_housing': 'Filtrer par logements inclus',
      
      // Listings
      'listing_not_found': 'Logement non trouvé',
      'listing_not_exist': 'Le logement que vous recherchez n\'existe pas ou a été supprimé.',
      'back_to_home': 'Retour à l\'accueil',
      
      // Testimonials
      'share_experience': 'Partagez votre expérience',
      'testimonial_description': 'Votre avis nous aide à améliorer notre service et aide d\'autres utilisateurs à faire leur choix.',
      'share_your_experience': 'Partagez votre expérience avec notre plateforme...',
      'publish_testimonial': 'Publier mon témoignage',
      
      // Reservations
      'save_as_pdf': 'Enregistrer en PDF',
      'add_to_calendar': 'Ajouter au calendrier',
      'add_to_google': 'Ajouter à Google',

      // Jobs descriptions
      'housing_included_desc': 'Logements de qualité fournis',
      'job_description': 'Description du poste',
      'job_description_desc': 'Missions claires et détaillées',
      'benefits': 'Avantages',
      'benefits_desc': 'Packages attractifs et compétitifs'
    };
    
    // Return the translation or the key if not found
    return translations[key] || key;
  };
  
  // Function to set language (no-op since we only use French)
  const setLanguage = (lang: 'fr') => {
    // This function does nothing in our simplified version
    console.log('Langue réglée sur:', lang);
  };
  
  return { language, t, setLanguage };
};

// Provider component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const languageContext = useLanguageProvider();

  return (
    <LanguageContext.Provider value={languageContext}>
      {children}
    </LanguageContext.Provider>
  );
};
