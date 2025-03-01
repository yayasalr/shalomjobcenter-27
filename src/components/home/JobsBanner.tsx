
import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsBanner = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg mb-16">
      <div className="bg-gradient-to-r p-0.5 from-sholom-primary to-sholom-secondary">
        <div className="bg-white dark:bg-gray-900 rounded-[inherit] p-px">
          <div className="rounded-[inherit] bg-gradient-to-r from-sholom-primary to-sholom-secondary overflow-hidden">
            <div className="md:flex items-center">
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-serif font-bold text-white mb-4">
                  Découvrez nos offres d'emploi
                </h2>
                <p className="text-white/80 mb-6 text-lg">
                  Des opportunités dans la sécurité et des logements exclusifs pour nos employés
                </p>
                <Link
                  to="/emplois"
                  className="inline-flex items-center bg-white text-sholom-primary font-semibold px-6 py-3 rounded-md shadow hover:bg-blue-50 transition-all group"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Voir les offres
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="md:w-1/3 p-6 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                  <Briefcase className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
