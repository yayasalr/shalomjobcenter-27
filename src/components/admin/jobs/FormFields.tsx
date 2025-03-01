
import React from 'react';
import {
  BasicInfoFields,
  JobDetailsFields,
  ContractFields,
  LocationFields,
  CompensationFields,
  HousingFields,
  DeadlineField
} from './form-fields';

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
  contract: string;
  setContract: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  salary: number;
  setSalary: (value: number) => void;
  positions: number;
  setPositions: (value: number) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  isHousingOffer?: boolean;
  price?: number;
  setPrice?: (value: number) => void;
  bedrooms?: number;
  setBedrooms?: (value: number) => void;
  bathrooms?: number;
  setBathrooms?: (value: number) => void;
  images?: string[];
  onAddImage?: () => void;
  onUpdateImage?: (index: number, value: string) => void;
  onRemoveImage?: (index: number) => void;
  isUploading?: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
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
  isHousingOffer = false,
  price = 0,
  setPrice,
  bedrooms = 1,
  setBedrooms,
  bathrooms = 1,
  setBathrooms,
  images = [],
  onAddImage,
  onRemoveImage,
  isUploading = false
}) => {
  return (
    <div className="space-y-6">
      <BasicInfoFields
        title={title}
        setTitle={setTitle}
        domain={domain}
        setDomain={setDomain}
        isHousingOffer={isHousingOffer}
      />

      <JobDetailsFields
        description={description}
        setDescription={setDescription}
        requirements={requirements}
        setRequirements={setRequirements}
        isHousingOffer={isHousingOffer}
      />

      {!isHousingOffer && (
        <ContractFields
          contract={contract}
          setContract={setContract}
        />
      )}

      <LocationFields
        location={location}
        setLocation={setLocation}
      />

      <CompensationFields
        salary={salary}
        setSalary={setSalary}
        positions={positions}
        setPositions={setPositions}
        isHousingOffer={isHousingOffer}
        price={price}
        setPrice={setPrice}
      />

      {isHousingOffer && setBedrooms && setBathrooms && (
        <HousingFields
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          bathrooms={bathrooms}
          setBathrooms={setBathrooms}
          images={images}
          onAddImage={onAddImage}
          onRemoveImage={onRemoveImage}
          isUploading={isUploading}
        />
      )}

      <DeadlineField
        deadline={deadline}
        setDeadline={setDeadline}
      />
    </div>
  );
};
