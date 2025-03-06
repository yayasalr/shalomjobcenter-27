
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotAuthenticated: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 rounded-full p-3">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Authentification requise</h2>
        
        <p className="text-gray-500 mb-6">
          Vous devez être connecté pour accéder à vos messages. Veuillez vous connecter ou créer un compte.
        </p>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-center">
          <Button asChild>
            <Link to="/login">
              Se connecter
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/register">
              Créer un compte
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotAuthenticated;
