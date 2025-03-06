
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TermsOfUse = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p className="mb-4">
            En accédant et en utilisant le site web de {settings.siteName}, vous acceptez de vous conformer 
            et d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, 
            veuillez ne pas utiliser notre site.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">2. Modifications des conditions</h2>
          <p className="mb-4">
            {settings.siteName} se réserve le droit de modifier ces conditions d'utilisation à tout moment. 
            Les modifications entreront en vigueur dès leur publication sur le site. Il est de votre responsabilité 
            de consulter régulièrement ces conditions.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">3. Utilisation du site</h2>
          <p className="mb-4">
            Vous acceptez d'utiliser le site uniquement à des fins légales et d'une manière qui ne porte pas atteinte 
            aux droits d'autrui ou qui n'entrave pas l'utilisation du site par d'autres utilisateurs.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">4. Comptes utilisateurs</h2>
          <p className="mb-4">
            Certaines fonctionnalités du site peuvent nécessiter la création d'un compte. Vous êtes responsable de 
            maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent 
            sous votre compte.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">5. Propriété intellectuelle</h2>
          <p className="mb-4">
            Tout le contenu présent sur le site, y compris mais sans s'y limiter, les textes, graphiques, logos, images, 
            ainsi que la compilation de tous ces éléments, sont la propriété de {settings.siteName} ou de ses fournisseurs 
            de contenu et sont protégés par les lois sur le droit d'auteur et la propriété intellectuelle.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">6. Limitation de responsabilité</h2>
          <p className="mb-4">
            {settings.siteName} ne sera pas responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs 
            résultant de votre accès ou de votre utilisation du site.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">7. Loi applicable</h2>
          <p className="mb-4">
            Ces conditions d'utilisation sont régies par les lois du Togo. Tout litige relatif à ces conditions sera soumis 
            à la juridiction exclusive des tribunaux de Lomé, Togo.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-4">
            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse suivante :<br />
            {settings.companyInfo.email}<br />
            {settings.companyInfo.address}<br />
            {settings.companyInfo.phone}
          </p>
          
          <p className="mt-8 text-sm text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
