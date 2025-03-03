
import React from 'react';
import { UserCircle2, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Doumbia",
      role: "Étudiante",
      content: "J'ai trouvé un logement parfait pour mon année d'études en quelques clics. Le processus était simple et transparent.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    {
      id: 2,
      name: "Jean-Marc Koné",
      role: "Professionnel",
      content: "J'ai obtenu un excellent poste grâce à cette plateforme. Les filtres de recherche m'ont permis de trouver exactement ce que je cherchais.",
      rating: 5
    },
    {
      id: 3,
      name: "Marie Touré",
      role: "Propriétaire",
      content: "Mettre mon appartement en location a été très facile. J'ai reçu plusieurs demandes sérieuses en quelques jours seulement.",
      rating: 4
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 w-full">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-sholom-dark mb-4 elegant-title">
            Ce que nos utilisateurs disent
          </h2>
          <p className="text-sholom-muted max-w-2xl mx-auto">
            Découvrez les expériences de personnes qui ont utilisé notre plateforme pour trouver un logement ou un emploi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-sholom-primary-lighter opacity-20" />
                <p className="text-gray-600 mb-4 pt-4 italic">"{testimonial.content}"</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="flex items-center">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-gray-300 mr-4" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sholom-muted text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" className="hover:-translate-y-1 transition-transform duration-300">
            Rejoignez notre communauté
          </Button>
        </div>
      </div>
    </div>
  );
};
