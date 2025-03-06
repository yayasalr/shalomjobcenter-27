
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const BenefitsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avantages des comptes liés</CardTitle>
        <CardDescription>Pourquoi connecter vos comptes sociaux</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc pl-5">
          <li>Connexion plus rapide avec un seul clic</li>
          <li>Récupération de compte simplifiée</li>
          <li>Importer automatiquement votre photo de profil et vos informations</li>
          <li>Partager facilement vos réservations et expériences</li>
        </ul>
      </CardContent>
    </Card>
  );
};
