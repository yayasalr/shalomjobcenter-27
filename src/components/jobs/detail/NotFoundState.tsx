
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const NotFoundState = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Offre introuvable</h1>
          <p className="text-gray-500 mb-8">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
          <Link to="/emplois">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retourner aux offres
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundState;
