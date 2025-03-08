
import { JobFormStateWithSetters } from './types';

export const useFormReset = (formState: JobFormStateWithSetters) => {
  const {
    setTitle,
    setDomain,
    setDescription,
    setRequirements,
    setContract,
    setLocation,
    setSalary,
    setPositions,
    setDeadline,
    setIsHousingOffer,
    setPrice,
    setBedrooms,
    setBathrooms,
    setImages,
    setIsPublished,
    setFeaturedImage
  } = formState;

  const resetForm = () => {
    setTitle('');
    setDomain('residential_security');
    setDescription('');
    setRequirements('');
    setContract('full_time');
    setLocation('');
    setSalary(0);
    setPositions(1);
    setDeadline('');
    setIsHousingOffer(false);
    setPrice(0);
    setBedrooms(1);
    setBathrooms(1);
    setImages([]);
    setIsPublished(true);
    setFeaturedImage('');
  };

  return { resetForm };
};
