
import { TranslationDictionary } from '../../types';
import { heroTranslations } from './hero';
import { featuresTranslations } from './features';
import { neighborhoodsTranslations } from './neighborhoods';
import { testimonialsTranslations } from './testimonials';
import { searchTranslations } from './search';
import { statusTranslations } from './status';

// Merge all home-related translations into a single dictionary
const mergeTranslations = (...dictionaries: TranslationDictionary[]): TranslationDictionary => {
  return dictionaries.reduce((result, current) => ({ ...result, ...current }), {});
};

// Export the complete home translations dictionary
export const homeTranslations: TranslationDictionary = mergeTranslations(
  heroTranslations,
  featuresTranslations,
  neighborhoodsTranslations,
  testimonialsTranslations,
  searchTranslations,
  statusTranslations
);
