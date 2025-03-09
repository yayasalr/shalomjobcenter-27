
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/language';

interface TestimonialFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRating: number;
  setNewRating: (rating: number) => void;
  newTestimonial: string;
  setNewTestimonial: (testimonial: string) => void;
  onSubmit: () => void;
}

export const TestimonialFormDialog = ({
  isOpen,
  onOpenChange,
  newRating,
  setNewRating,
  newTestimonial,
  setNewTestimonial,
  onSubmit
}: TestimonialFormDialogProps) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('share_experience')}</DialogTitle>
          <DialogDescription>
            {t('testimonial_description') || 'Votre avis nous aide à améliorer notre service et aide d\'autres utilisateurs à faire leur choix.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= newRating
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder={t('share_your_experience') || "Partagez votre expérience avec notre plateforme..."}
            value={newTestimonial}
            onChange={(e) => setNewTestimonial(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            className="bg-airbnb-red hover:bg-airbnb-red/90"
            onClick={onSubmit}
          >
            {t('publish_testimonial') || 'Publier mon témoignage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
