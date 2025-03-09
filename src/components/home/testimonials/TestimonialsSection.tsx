
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTestimonials } from './useTestimonials';
import { TestimonialsList } from './TestimonialsList';
import { TestimonialFormDialog } from './TestimonialFormDialog';
import { useAuth } from '@/hooks/auth/useAuth';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const TestimonialsSection = () => {
  const { user } = useAuth();
  const {
    testimonials,
    activeIndex,
    isDialogOpen,
    setIsDialogOpen,
    newTestimonial,
    setNewTestimonial,
    newRating,
    setNewRating,
    showPrevious,
    showNext,
    handleAddTestimonial,
    handleJoinCommunity,
    handleAddReview
  } = useTestimonials();

  return (
    <div className="bg-white py-16 w-full">
      <div className="content-container">
        <ScrollAnimation direction="right">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900">
              Ce que nos utilisateurs disent
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les expériences de personnes qui ont utilisé notre plateforme pour trouver un logement ou un emploi.
            </p>
            
            {user && (
              <Button 
                variant="outline" 
                onClick={handleAddReview}
                className="mt-4 border-airbnb-red text-airbnb-red hover:bg-airbnb-red/10"
              >
                Partagez votre expérience
              </Button>
            )}
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <TestimonialsList 
            testimonials={testimonials}
            activeIndex={activeIndex}
            showPrevious={showPrevious}
            showNext={showNext}
          />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.5}>
          <div className="text-center mt-8">
            <Button 
              variant="default" 
              className="bg-airbnb-red hover:bg-airbnb-red/90 text-white px-6 py-2 rounded-lg font-medium"
              onClick={handleJoinCommunity}
            >
              Rejoignez notre communauté
            </Button>
          </div>
        </ScrollAnimation>
      </div>

      <TestimonialFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        newRating={newRating}
        setNewRating={setNewRating}
        newTestimonial={newTestimonial}
        setNewTestimonial={setNewTestimonial}
        onSubmit={handleAddTestimonial}
      />
    </div>
  );
};
