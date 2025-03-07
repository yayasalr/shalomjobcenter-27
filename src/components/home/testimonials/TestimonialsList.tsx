
import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from './types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestimonialsListProps {
  testimonials: Testimonial[];
  activeIndex: number;
  showPrevious: () => void;
  showNext: () => void;
}

export const TestimonialsList = ({ 
  testimonials, 
  activeIndex, 
  showPrevious, 
  showNext 
}: TestimonialsListProps) => {
  // Filter testimonials for responsive display
  const displayedTestimonials = window.innerWidth < 768 ? 
    [testimonials[activeIndex]] : 
    testimonials;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayedTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="rounded-full p-2 h-10 w-10"
          aria-label="Témoignage précédent"
          onClick={showPrevious}
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full p-2 h-10 w-10"
          aria-label="Témoignage suivant"
          onClick={showNext}
        >
          <ArrowRight className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
    </>
  );
};
