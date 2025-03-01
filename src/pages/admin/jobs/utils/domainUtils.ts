
export const getDomainName = (domain: string): string => {
  const domains: Record<string, string> = {
    'residential_security': 'Sécurité résidentielle',
    'bodyguard': 'Garde du corps',
    'private_property': 'Propriétés privées',
    'industrial_security': 'Sécurité industrielle',
    'event_security': 'Sécurité événementielle',
    'k9_security': 'Maître-chien',
    'security_trainer': 'Formateur sécurité',
    'housing_offer': 'Offre de logement',
    'office_security': 'Sécurité de bureau',
    'security_patrol': 'Patrouilleur',
    'access_control': 'Contrôle d\'accès',
    'security_systems': 'Opérateur systèmes',
    'construction_security': 'Sécurité chantier',
    'site_supervisor': 'Surveillant travaux',
    'security_coordinator': 'Coordinateur sécurité',
    'security_manager': 'Responsable sécurité',
    'security_consultant': 'Consultant sécurité'
  };
  
  return domains[domain] || domain;
};
