
import { TranslationDictionary } from '../../types';
import { jobsGeneralTranslations } from './general';
import { jobsFiltersTranslations } from './filters';
import { jobsBenefitsTranslations } from './benefits';
import { jobsDetailsTranslations } from './details';
import { jobsApplicationTranslations } from './application';
import { jobsStatusTranslations } from './status';

// Merge all jobs-related translations into a single dictionary
const mergeTranslations = (...dictionaries: TranslationDictionary[]): TranslationDictionary => {
  return dictionaries.reduce((result, current) => ({ ...result, ...current }), {});
};

// Export the complete jobs translations dictionary
export const jobsTranslations: TranslationDictionary = mergeTranslations(
  jobsGeneralTranslations,
  jobsFiltersTranslations,
  jobsBenefitsTranslations,
  jobsDetailsTranslations,
  jobsApplicationTranslations,
  jobsStatusTranslations
);
