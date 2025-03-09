
import { TranslationDictionary } from '../../types';
import { reviewsTranslations } from './reviews';
import { housingTranslations } from './housing';
import { actionsTranslations } from './actions';
import { usersTranslations } from './users';
import { miscTranslations } from './misc';

// Merge all general subcategory translations into a single dictionary
const mergeTranslations = (...dictionaries: TranslationDictionary[]): TranslationDictionary => {
  return dictionaries.reduce((result, current) => ({ ...result, ...current }), {});
};

// Export the complete general translations dictionary
export const generalTranslations: TranslationDictionary = mergeTranslations(
  reviewsTranslations,
  housingTranslations,
  actionsTranslations,
  usersTranslations,
  miscTranslations
);

// Also export individual subcategory translations
export {
  reviewsTranslations,
  housingTranslations,
  actionsTranslations,
  usersTranslations,
  miscTranslations
};
