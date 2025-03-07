
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Testimonial } from './types';
import { useAuth } from '@/hooks/auth';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
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
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [newRating, setNewRating] = useState(5);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation in testimonials
  const showPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Handle testimonial submission
  const handleAddTestimonial = () => {
    if (newTestimonial.trim().length < 10) {
      toast.error("Votre témoignage doit contenir au moins 10 caractères");
      return;
    }

    const newId = Math.max(...testimonials.map(t => t.id)) + 1;
    const testimonial: Testimonial = {
      id: newId,
      name: user?.name || "Utilisateur",
      role: "Membre",
      content: newTestimonial,
      rating: newRating,
      image: user?.avatar
    };

    setTestimonials([testimonial, ...testimonials]);
    setNewTestimonial("");
    setNewRating(5);
    setIsDialogOpen(false);
    toast.success("Merci pour votre témoignage !");
  };

  // Handle community actions
  const handleJoinCommunity = () => {
    if (user) {
      setIsDialogOpen(true);
    } else {
      navigate('/register');
    }
  };
  
  const handleAddReview = () => {
    if (user) {
      setIsDialogOpen(true);
    } else {
      toast.error("Veuillez vous connecter pour laisser un avis");
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return {
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
  };
};
