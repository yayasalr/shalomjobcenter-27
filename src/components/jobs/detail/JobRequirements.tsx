
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface JobRequirementsProps {
  isHousingOffer: boolean;
  requirements: string;
  bedrooms?: number;
  bathrooms?: number;
}

const JobRequirements = ({ 
  isHousingOffer, 
  requirements, 
  bedrooms, 
  bathrooms 
}: JobRequirementsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-sholom-dark">
        {isHousingOffer ? 'Caractéristiques' : 'Exigences'}
      </h3>
      <div className="text-gray-700 space-y-4">
        {isHousingOffer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bedrooms && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-sholom-primary mr-2" />
                <span>{bedrooms} chambre{bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-sholom-primary mr-2" />
                <span>{bathrooms} salle{bathrooms > 1 ? 's' : ''} de bain</span>
              </div>
            )}
            {requirements.split('\n').map((req, index) => (
              req && (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-sholom-primary mr-2 mt-0.5" />
                  <span>{req}</span>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {requirements.split('\n').map((req, index) => (
              req && (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-sholom-primary mr-2 mt-0.5" />
                  <span>{req}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRequirements;
