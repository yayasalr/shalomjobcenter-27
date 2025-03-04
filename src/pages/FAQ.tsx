
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/home/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BackButton } from '@/components/shared/BackButton';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const FAQ = () => {
  const { settings } = useSiteSettings();

  const faqItems = [
    {
      question: "Quels services de sécurité proposez-vous ?",
      answer: "Nous proposons une gamme complète de services de sécurité incluant le gardiennage professionnel, la protection rapprochée, le conseil en sécurité, et l'installation de systèmes d'alarme et de surveillance."
    },
    {
      question: "Comment engager un agent de sécurité ?",
      answer: "Pour engager un agent de sécurité, contactez-nous par téléphone ou via notre formulaire de contact. Un conseiller vous contactera pour évaluer vos besoins et vous proposer une solution adaptée."
    },
    {
      question: "Quelles sont vos zones d'intervention ?",
      answer: "Nous intervenons principalement à Lomé et dans les environs, mais nous pouvons étendre nos services à d'autres régions du Togo selon vos besoins spécifiques."
    },
    {
      question: "Vos agents sont-ils formés et certifiés ?",
      answer: "Oui, tous nos agents sont rigoureusement sélectionnés, formés et certifiés. Ils reçoivent une formation continue pour maintenir leurs compétences à jour."
    },
    {
      question: "Quelles mesures recommandez-vous pour sécuriser un domicile ?",
      answer: "Nous recommandons un ensemble de mesures incluant l'installation d'un éclairage adéquat des zones extérieures, la sécurisation des portes et fenêtres, l'installation d'un système d'alarme, et éventuellement la présence d'un agent de sécurité pour une protection optimale."
    },
    {
      question: "Proposez-vous des services de surveillance 24h/24 ?",
      answer: "Oui, nous offrons des services de surveillance et de gardiennage disponibles 24h/24 et 7j/7 pour assurer une protection continue de vos biens et de votre personnel."
    },
    {
      question: "Comment créer un compte sur votre site ?",
      answer: "Pour créer un compte, cliquez sur le bouton \"S'inscrire\" dans le menu en haut à droite. Remplissez le formulaire avec vos informations personnelles et suivez les instructions à l'écran."
    },
    {
      question: "Comment contacter votre service client ?",
      answer: "Vous pouvez nous contacter par téléphone au +228 90-19-03-41 ou par email à Shalomjob@gmail.com. Notre équipe est disponible du lundi au vendredi de 8h à 18h et le samedi de 9h à 15h."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="content-container max-w-3xl mx-auto">
          <div className="mb-4">
            <BackButton />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/94c4ec86-49e9-498e-8fd3-ecdc693ca9fd.png" 
                alt="Shalom Security Logo" 
                className="h-16 w-auto" 
              />
            </div>
            
            <h1 className="text-3xl font-semibold mb-6 text-center elegant-title">
              Questions fréquemment posées
            </h1>
            
            <p className="text-gray-600 mb-8 text-center">
              Trouvez rapidement des réponses aux questions les plus courantes sur nos services de sécurité.
              Si vous ne trouvez pas la réponse que vous cherchez, n'hésitez pas à nous contacter.
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-800">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="py-2 text-gray-600">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-200">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Vous avez encore des questions ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est disponible pour vous aider et répondre à toutes vos questions concernant nos services de sécurité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="py-3 px-6 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-300"
              >
                Nous contacter
              </a>
              <a 
                href="/support" 
                className="py-3 px-6 bg-white text-yellow-600 border border-yellow-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
              >
                Centre d'aide
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
