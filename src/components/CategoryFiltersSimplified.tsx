
import React from 'react';
import { Briefcase, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/language';

export const CategoryFiltersSimplified = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <div className="w-full border-b">
      <div className="flex overflow-x-auto py-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hide-scrollbar">
        <div className="flex space-x-12 mx-auto">
          <Link
            to="/emplois"
            className={`flex flex-col items-center justify-center text-sm font-medium min-w-[80px] ${
              location.pathname.includes('/emplois') ? 'text-black' : 'text-gray-500'
            }`}
          >
            <div className={`p-2 rounded-full mb-2 ${
              location.pathname.includes('/emplois') ? 'bg-gray-100' : ''
            }`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <span>{t('jobs')}</span>
          </Link>
          
          <Link
            to="/"
            className={`flex flex-col items-center justify-center text-sm font-medium min-w-[80px] ${
              location.pathname === '/' || location.pathname.includes('/logement') 
                ? 'text-black' 
                : 'text-gray-500'
            }`}
          >
            <div className={`p-2 rounded-full mb-2 ${
              location.pathname === '/' || location.pathname.includes('/logement') 
                ? 'bg-gray-100' 
                : ''
            }`}>
              <Home className="h-6 w-6" />
            </div>
            <span>{t('listings')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
