
import { TranslationDictionary } from '../types';
import { commonTranslations } from './common';
import { homeTranslations } from './home';
import { listingsTranslations } from './listings';
import { jobsTranslations } from './jobs';
import { profileTranslations } from './profile';

// Fonction pour fusionner toutes les traductions
const mergeTranslations = (...translationObjects: TranslationDictionary[]): TranslationDictionary => {
  return translationObjects.reduce((merged, current) => {
    return { ...merged, ...current };
  }, {});
};

// Exporter les traductions fusionnées
export const defaultTranslations: TranslationDictionary = mergeTranslations(
  commonTranslations,
  homeTranslations,
  listingsTranslations,
  jobsTranslations,
  profileTranslations
);

// Exporter également les traductions individuelles pour une utilisation spécifique si nécessaire
export {
  commonTranslations,
  homeTranslations,
  listingsTranslations,
  jobsTranslations,
  profileTranslations
};
