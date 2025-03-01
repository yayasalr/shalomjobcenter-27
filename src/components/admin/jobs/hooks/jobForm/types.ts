
import { Job, JobDomain, JobContract } from '@/types/job';

export interface UseJobFormProps {
  selectedJob?: Job | null;
  onSave: (formData: Omit<Job, "id">) => void;
  onCancel: () => void;
}

export interface JobFormState {
  isOpen: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  title: string;
  domain: JobDomain;
  description: string;
  requirements: string;
  contract: JobContract;
  location: string;
  salary: number;
  positions: number;
  deadline: string;
  isHousingOffer: boolean;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  isPublished: boolean;
  featuredImage: string;
}
