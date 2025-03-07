
import React from 'react';
import { UserCircle2, Star, Quote } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  // Function to render rating stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col h-full"
    >
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-airbnb-red opacity-20" />
        <p className="text-gray-700 mb-4 pt-4 italic">"{testimonial.content}"</p>
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
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
