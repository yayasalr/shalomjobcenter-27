
import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/home/Footer';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowRight, HelpCircle, Mail, MessageSquare, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Recherche de "${searchQuery}" effectuée`, {
      description: "Voici les résultats de votre recherche.",
    });
  };

  const faqCategories = [
    {
      title: "Logements",
      items: [
        {
          question: "Comment puis-je réserver un logement?",
          answer: "Pour réserver un logement, connectez-vous à votre compte, sélectionnez un logement qui vous intéresse, vérifiez la disponibilité et cliquez sur 'Réserver'. Suivez ensuite les instructions pour compléter votre réservation en fournissant les informations nécessaires et en effectuant le paiement."
        },
        {
          question: "Comment puis-je annuler une réservation?",
          answer: "Pour annuler une réservation, accédez à votre compte, naviguez vers 'Mes réservations', sélectionnez la réservation que vous souhaitez annuler et cliquez sur 'Annuler'. Veuillez noter que les politiques d'annulation varient selon les logements et peuvent affecter le remboursement."
        },
        {
          question: "Quels types de logements proposez-vous?",
          answer: "Nous proposons une variété de logements, allant des appartements aux maisons, en passant par les studios et les chambres partagées. Chaque logement est soigneusement vérifié pour garantir sa qualité et sa conformité à nos standards."
        }
      ]
    },
    {
      title: "Emplois",
      items: [
        {
          question: "Comment puis-je postuler à une offre d'emploi?",
          answer: "Pour postuler à une offre d'emploi, connectez-vous à votre compte, naviguez vers la section 'Emplois', sélectionnez l'offre qui vous intéresse et cliquez sur 'Postuler'. Vous devrez ensuite compléter votre candidature en fournissant votre CV et une lettre de motivation."
        },
        {
          question: "Les employeurs peuvent-ils me contacter directement?",
          answer: "Oui, une fois que vous avez postulé à une offre d'emploi, l'employeur peut vous contacter directement via notre plateforme de messagerie ou par email, selon les préférences que vous avez indiquées dans votre profil."
        },
        {
          question: "Comment mettre à jour mon CV sur la plateforme?",
          answer: "Pour mettre à jour votre CV, accédez à votre compte, naviguez vers 'Mon profil' > 'Informations professionnelles', puis cliquez sur 'Modifier' à côté de votre CV actuel. Vous pourrez alors télécharger une nouvelle version de votre CV."
        }
      ]
    },
    {
      title: "Compte et Sécurité",
      items: [
        {
          question: "Comment créer un compte?",
          answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut à droite de la page d'accueil. Remplissez le formulaire avec vos informations personnelles, acceptez les conditions d'utilisation et cliquez sur 'Créer un compte'. Vous recevrez ensuite un email pour confirmer votre adresse email."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire?",
          answer: "Si vous avez oublié votre mot de passe, cliquez sur 'Se connecter', puis sur 'Mot de passe oublié?'. Entrez l'adresse email associée à votre compte et suivez les instructions pour réinitialiser votre mot de passe."
        },
        {
          question: "Comment modifier mes informations personnelles?",
          answer: "Pour modifier vos informations personnelles, connectez-vous à votre compte, accédez à 'Mon profil', puis cliquez sur 'Modifier mon profil'. Vous pourrez alors mettre à jour vos informations et enregistrer les modifications."
        }
      ]
    },
    {
      title: "Paiements",
      items: [
        {
          question: "Quels modes de paiement acceptez-vous?",
          answer: "Nous acceptons plusieurs modes de paiement, notamment les cartes de crédit/débit (Visa, Mastercard), les virements bancaires et les paiements mobile money (comme Flooz et T-Money au Togo)."
        },
        {
          question: "Les paiements sont-ils sécurisés?",
          answer: "Oui, tous les paiements effectués sur notre plateforme sont sécurisés. Nous utilisons des protocoles de cryptage avancés pour protéger vos informations financières et nous ne stockons pas les détails de votre carte de crédit."
        },
        {
          question: "Comment obtenir une facture pour ma réservation?",
          answer: "Une facture est automatiquement générée et envoyée à votre adresse email après chaque paiement. Vous pouvez également accéder à vos factures en vous connectant à votre compte et en naviguant vers 'Mes réservations' > 'Historique des paiements'."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Centre d'Aide et Support</h1>
          
          <div className="mb-10">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Rechercher dans notre base de connaissances..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                style={{ backgroundColor: settings.primaryColor }}
              >
                Rechercher
              </Button>
            </form>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <HelpCircle className="h-12 w-12 mx-auto mb-4" style={{ color: settings.primaryColor }} />
              <h3 className="text-lg font-semibold mb-2">FAQ</h3>
              <p className="text-gray-600 mb-4">Trouvez des réponses aux questions fréquemment posées.</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="#faq">
                  Consulter la FAQ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: settings.primaryColor }} />
              <h3 className="text-lg font-semibold mb-2">Chat Support</h3>
              <p className="text-gray-600 mb-4">Discutez en direct avec notre équipe de support.</p>
              <Button className="w-full" style={{ backgroundColor: settings.primaryColor }} asChild>
                <Link to="/messages">
                  Démarrer le chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <Mail className="h-12 w-12 mx-auto mb-4" style={{ color: settings.primaryColor }} />
              <h3 className="text-lg font-semibold mb-2">Contactez-nous</h3>
              <p className="text-gray-600 mb-4">Envoyez-nous un message pour toute question.</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">
                  Formulaire de contact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8" id="faq">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: settings.primaryColor }}>Foire Aux Questions</h2>
            
            {faqCategories.map((category, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <h3 className="text-xl font-medium mb-4">{category.title}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, itemIdx) => (
                    <AccordionItem key={itemIdx} value={`item-${idx}-${itemIdx}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Vous n'avez pas trouvé ce que vous cherchiez?</p>
              <Button asChild style={{ backgroundColor: settings.primaryColor }}>
                <Link to="/contact">
                  Contactez notre équipe de support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
