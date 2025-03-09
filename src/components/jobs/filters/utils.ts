
import { useLanguage } from '@/hooks/language';

export const translateDomain = (domain: string) => {
  const domains: {[key: string]: string} = {
    'residential_security': 'Sécurité résidentielle',
    'bodyguard': 'Garde du corps',
    'private_property': 'Propriétés privées',
    'industrial_security': 'Sécurité industrielle',
    'office_security': 'Sécurité de bureau',
    'security_patrol': 'Patrouilleur',
    'access_control': 'Contrôle d\'accès',
    'security_systems': 'Opérateur systèmes',
    'construction_security': 'Sécurité chantier',
    'site_supervisor': 'Surveillant travaux',
    'security_coordinator': 'Coordinateur sécurité',
    'event_security': 'Sécurité événementielle',
    'k9_security': 'Maître-chien',
    'security_manager': 'Responsable sécurité',
    'security_consultant': 'Consultant sécurité',
    'security_trainer': 'Formateur sécurité',
    'housing_offer': 'Offre de logement',
    'all': 'Tous les domaines'
  };
  
  return domains[domain] || domain;
};

export const translateContract = (contract: string) => {
  const contractsMapFR: {[key: string]: string} = {
    'full_time': 'CDI',
    'part_time': 'Temps partiel',
    'contract': 'CDD',
    'all': 'Tous les contrats'
  };
  
  return contractsMapFR[contract] || contract;
};
