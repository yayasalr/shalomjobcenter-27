
import { useState, useEffect } from 'react';
import { JobDomain, JobContract } from '@/types/job';
import { UseJobFormProps, JobFormState } from './types';

export const useFormState = ({ selectedJob }: UseJobFormProps): JobFormState & {
  setIsOpen: (value: boolean) => void;
  setTitle: (value: string) => void;
  setDomain: (value: JobDomain) => void;
  setDescription: (value: string) => void;
  setRequirements: (value: string) => void;
  setContract: (value: JobContract) => void;
  setLocation: (value: string) => void;
  setSalary: (value: number) => void;
  setPositions: (value: number) => void;
  setDeadline: (value: string) => void;
  setIsHousingOffer: (value: boolean) => void;
  setPrice: (value: number) => void;
  setBedrooms: (value: number) => void;
  setBathrooms: (value: number) => void;
  setImages: (value: string[]) => void;
  setIsPublished: (value: boolean) => void;
  setFeaturedImage: (value: string) => void;
} => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState(selectedJob?.title || '');
  const [domain, setDomain] = useState<JobDomain>(selectedJob?.domain || 'residential_security');
  const [description, setDescription] = useState(selectedJob?.description || '');
  const [requirements, setRequirements] = useState(selectedJob?.requirements || '');
  const [contract, setContract] = useState<JobContract>(selectedJob?.contract || 'full_time');
  const [location, setLocation] = useState(selectedJob?.location || '');
  const [salary, setSalary] = useState(selectedJob?.salary?.amount || 0);
  const [positions, setPositions] = useState(selectedJob?.positions || 1);
  const [deadline, setDeadline] = useState(selectedJob?.deadline || '');
  const [isHousingOffer, setIsHousingOffer] = useState(selectedJob?.isHousingOffer || false);
  const [price, setPrice] = useState(selectedJob?.price || 0);
  const [bedrooms, setBedrooms] = useState(selectedJob?.bedrooms || 1);
  const [bathrooms, setBathrooms] = useState(selectedJob?.bathrooms || 1);
  const [images, setImages] = useState<string[]>(selectedJob?.images || []);
  const [isPublished, setIsPublished] = useState(selectedJob?.status === 'active');
  const [featuredImage, setFeaturedImage] = useState(selectedJob?.image || '');

  // Populate form when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      setIsOpen(true);
      setTitle(selectedJob.title);
      setDomain(selectedJob.domain);
      setDescription(selectedJob.description);
      setRequirements(selectedJob.requirements);
      setContract(selectedJob.contract);
      setLocation(selectedJob.location);
      setSalary(selectedJob.salary.amount);
      setPositions(selectedJob.positions);
      setDeadline(selectedJob.deadline);
      setIsHousingOffer(!!selectedJob.isHousingOffer);
      setPrice(selectedJob.price || 0);
      setBedrooms(selectedJob.bedrooms || 1);
      setBathrooms(selectedJob.bathrooms || 1);
      setImages(selectedJob.images || []);
      setIsPublished(selectedJob.status === 'active');
      setFeaturedImage(selectedJob.image || '');
    }
  }, [selectedJob]);

  return {
    isOpen,
    setIsOpen,
    isSubmitting,
    setIsSubmitting,
    isUploading,
    setIsUploading,
    title,
    setTitle,
    domain,
    setDomain,
    description,
    setDescription,
    requirements,
    setRequirements,
    contract,
    setContract,
    location,
    setLocation,
    salary,
    setSalary,
    positions,
    setPositions,
    deadline,
    setDeadline,
    isHousingOffer,
    setIsHousingOffer,
    price,
    setPrice,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    images,
    setImages,
    isPublished,
    setIsPublished,
    featuredImage,
    setFeaturedImage
  };
};
