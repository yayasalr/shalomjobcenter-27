
import { TranslationDictionary } from '../../types';
import { uiTranslations } from './ui';
import { statusTranslations } from './status';
import { locationTranslations } from './locations';
import { timeTranslations } from './time';
import { generalTranslations, reviewsTranslations, housingTranslations, actionsTranslations, usersTranslations, miscTranslations } from './general';

// Merge all common translations into a single dictionary
const mergeTranslations = (...dictionaries: TranslationDictionary[]): TranslationDictionary => {
  return dictionaries.reduce((result, current) => ({ ...result, ...current }), {});
};

// Export the complete common translations dictionary
export const commonTranslations: TranslationDictionary = mergeTranslations(
  uiTranslations,
  statusTranslations,
  locationTranslations,
  timeTranslations,
  generalTranslations
);

// Also export individual category translations
export {
  uiTranslations,
  statusTranslations,
  locationTranslations,
  timeTranslations,
  generalTranslations,
  // New subcategories
  reviewsTranslations,
  housingTranslations,
  actionsTranslations,
  usersTranslations,
  miscTranslations
};
