
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const PrivacyPolicy = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            Cette politique de confidentialité décrit comment {settings.siteName} collecte, utilise et partage vos 
            informations personnelles lorsque vous utilisez notre site web et nos services.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">1. Informations que nous collectons</h2>
          <p className="mb-4">
            Nous pouvons collecter les types d'informations suivants :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Informations personnelles : nom, adresse e-mail, numéro de téléphone</li>
            <li>Informations de compte : nom d'utilisateur, mot de passe</li>
            <li>Informations de profil : photo, CV, expériences professionnelles</li>
            <li>Données d'utilisation : interactions avec le site, pages visitées</li>
            <li>Informations techniques : adresse IP, type de navigateur, appareil utilisé</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">2. Comment nous utilisons vos informations</h2>
          <p className="mb-4">
            Nous utilisons vos informations pour :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fournir, maintenir et améliorer nos services</li>
            <li>Traiter vos candidatures et demandes</li>
            <li>Communiquer avec vous concernant votre compte ou nos services</li>
            <li>Vous envoyer des informations sur les offres d'emploi pertinentes</li>
            <li>Détecter et prévenir les fraudes et abus</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">3. Partage d'informations</h2>
          <p className="mb-4">
            Nous pouvons partager vos informations dans les circonstances suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Avec les employeurs lorsque vous postulez à une offre d'emploi</li>
            <li>Avec nos fournisseurs de services qui nous aident à exploiter notre plateforme</li>
            <li>Pour se conformer aux obligations légales</li>
            <li>Pour protéger les droits et la sécurité de {settings.siteName} et de nos utilisateurs</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">4. Vos droits</h2>
          <p className="mb-4">
            Vous avez le droit de :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accéder aux informations personnelles que nous détenons à votre sujet</li>
            <li>Demander la correction d'informations inexactes</li>
            <li>Demander la suppression de vos informations</li>
            <li>Vous opposer au traitement de vos informations</li>
            <li>Demander la limitation du traitement de vos informations</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">5. Sécurité des données</h2>
          <p className="mb-4">
            Nous prenons des mesures de sécurité raisonnables pour protéger vos informations contre l'accès 
            non autorisé, l'altération, la divulgation ou la destruction.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">6. Conservation des données</h2>
          <p className="mb-4">
            Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services, 
            respecter nos obligations légales, résoudre les litiges et faire respecter nos accords.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">7. Modifications de cette politique</h2>
          <p className="mb-4">
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons 
            de tout changement important en publiant la nouvelle politique sur cette page.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-4">
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :<br />
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

export default PrivacyPolicy;
