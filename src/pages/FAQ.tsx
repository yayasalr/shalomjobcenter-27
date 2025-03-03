
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/home/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BackButton } from '@/components/shared/BackButton';

const FAQ = () => {
  const faqItems = [
    {
      question: "Comment créer un compte sur Shalom Job Center ?",
      answer: "Pour créer un compte, cliquez sur le bouton \"S'inscrire\" dans le menu en haut à droite. Remplissez le formulaire avec vos informations personnelles et suivez les instructions à l'écran."
    },
    {
      question: "Comment trouver un logement ?",
      answer: "Utilisez la barre de recherche sur la page d'accueil pour trouver des logements par localisation. Vous pouvez filtrer les résultats par type de logement, prix, et caractéristiques."
    },
    {
      question: "Comment postuler à une offre d'emploi ?",
      answer: "Accédez à la page des offres d'emploi, sélectionnez l'offre qui vous intéresse, et cliquez sur le bouton \"Postuler\". Vous devrez être connecté à votre compte pour soumettre votre candidature."
    },
    {
      question: "Comment contacter un propriétaire ?",
      answer: "Sur la page de détail d'un logement, vous trouverez un bouton \"Contacter le propriétaire\". Cliquez dessus pour envoyer un message au propriétaire. Vous devez être connecté pour utiliser cette fonctionnalité."
    },
    {
      question: "Comment modifier mon profil ?",
      answer: "Connectez-vous à votre compte, accédez à votre profil en cliquant sur votre avatar en haut à droite, puis sélectionnez \"Modifier le profil\". Vous pourrez y modifier vos informations personnelles et professionnelles."
    },
    {
      question: "Comment publier une annonce de logement ?",
      answer: "Après vous être connecté, accédez à votre tableau de bord et cliquez sur \"Publier une annonce\". Remplissez le formulaire avec les détails de votre logement, ajoutez des photos et définissez le prix."
    },
    {
      question: "Comment signaler un problème ?",
      answer: "Si vous rencontrez un problème, utilisez le formulaire de contact accessible depuis le pied de page du site ou envoyez un email directement à notre équipe de support à support@shalomjobcenter.com."
    },
    {
      question: "Quels sont les délais de réponse pour les candidatures ?",
      answer: "Les délais de réponse varient selon les employeurs. En général, vous devriez recevoir une réponse dans les 7 à 14 jours après votre candidature. Vous pouvez consulter le statut de vos candidatures dans votre espace personnel."
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
            <h1 className="text-3xl font-semibold text-sholom-dark mb-6 elegant-title">
              Questions fréquemment posées
            </h1>
            
            <p className="text-sholom-muted mb-8">
              Trouvez rapidement des réponses aux questions les plus courantes sur notre plateforme.
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
          
          <div className="bg-sholom-primary bg-opacity-5 rounded-xl p-8 border border-sholom-primary border-opacity-10">
            <h2 className="text-xl font-medium text-sholom-dark mb-4">
              Vous avez encore des questions ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est disponible pour vous aider et répondre à toutes vos questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="py-3 px-6 bg-sholom-primary text-white rounded-lg font-medium hover:bg-sholom-primary-dark transition-colors duration-300"
              >
                Nous contacter
              </a>
              <a 
                href="/support" 
                className="py-3 px-6 bg-white text-sholom-primary border border-sholom-primary rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
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
