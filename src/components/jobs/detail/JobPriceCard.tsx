
import React from 'react';
import { formatPriceFCFA } from '../utils/jobUtils';

interface JobPriceCardProps {
  price?: number;
}

const JobPriceCard = ({ price = 0 }: JobPriceCardProps) => {
  return (
    <div className="mb-8 bg-sholom-primary/5 rounded-lg p-4 border border-sholom-primary/20">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sholom-dark">Prix du logement</h3>
        <div className="text-xl font-bold text-sholom-primary">
          {formatPriceFCFA(price)} FCFA<span className="text-sm font-normal text-gray-500 ml-1">/ mois</span>
        </div>
      </div>
    </div>
  );
};

export default JobPriceCard;
