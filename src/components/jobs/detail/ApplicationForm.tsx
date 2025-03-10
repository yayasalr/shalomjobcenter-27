
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Job } from '@/types/job';
import { JobApplicationFormData } from '@/types/jobApplications';
import { useJobs } from '@/hooks/useJobs';

interface ApplicationFormProps {
  job: Job;
  onSuccess?: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onSuccess }) => {
  const { applyForJob } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<JobApplicationFormData, 'jobId'>>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log("Soumission de candidature pour:", job.id);
      await applyForJob.mutateAsync({
        jobId: job.id,
        ...formData
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
      });
      
      toast.success("Votre candidature a été envoyée avec succès!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la candidature:", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre candidature");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Postuler à cette offre</h3>
      
      <div>
        <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Votre nom complet"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre.email@exemple.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Numéro de téléphone <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+228 XX XX XX XX"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="coverLetter">Lettre de motivation</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter || ''}
          onChange={handleChange}
          placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par ce poste..."
          className="min-h-[150px]"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-sholom-primary hover:bg-sholom-primary/90" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
      </Button>
    </form>
  );
};
