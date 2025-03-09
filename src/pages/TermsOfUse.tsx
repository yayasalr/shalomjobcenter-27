
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfUse = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <ScrollAnimation direction="down" duration={0.6}>
              <h1 className="text-3xl font-bold text-white">Conditions d'utilisation</h1>
              <p className="text-blue-100 mt-2">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </ScrollAnimation>
          </div>
          
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <ScrollAnimation direction="right" delay={0.1}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">1. Acceptation des conditions</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    En accédant et en utilisant le site web de {settings.siteName}, vous acceptez de vous conformer 
                    et d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, 
                    veuillez ne pas utiliser notre site.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.2}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">2. Modifications des conditions</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    {settings.siteName} se réserve le droit de modifier ces conditions d'utilisation à tout moment. 
                    Les modifications entreront en vigueur dès leur publication sur le site. Il est de votre responsabilité 
                    de consulter régulièrement ces conditions.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.3}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">3. Utilisation du site</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    Vous acceptez d'utiliser le site uniquement à des fins légales et d'une manière qui ne porte pas atteinte 
                    aux droits d'autrui ou qui n'entrave pas l'utilisation du site par d'autres utilisateurs.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.4}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">4. Comptes utilisateurs</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    Certaines fonctionnalités du site peuvent nécessiter la création d'un compte. Vous êtes responsable de 
                    maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent 
                    sous votre compte.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.5}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">5. Propriété intellectuelle</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    Tout le contenu présent sur le site, y compris mais sans s'y limiter, les textes, graphiques, logos, images, 
                    ainsi que la compilation de tous ces éléments, sont la propriété de {settings.siteName} ou de ses fournisseurs 
                    de contenu et sont protégés par les lois sur le droit d'auteur et la propriété intellectuelle.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.6}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">6. Limitation de responsabilité</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    {settings.siteName} ne sera pas responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs 
                    résultant de votre accès ou de votre utilisation du site.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.7}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">7. Loi applicable</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <p className="mb-4 text-gray-700">
                    Ces conditions d'utilisation sont régies par les lois du Togo. Tout litige relatif à ces conditions sera soumis 
                    à la juridiction exclusive des tribunaux de Lomé, Togo.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="right" delay={0.8}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">8. Contact</h2>
                  <Separator className="mb-4 bg-blue-200" />
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="mb-2 text-gray-700">
                      Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse suivante:
                    </p>
                    <p className="font-medium text-blue-700">
                      {settings.companyInfo.email}<br />
                      {settings.companyInfo.address}<br />
                      {settings.companyInfo.phone}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
