
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Calendar, BadgeDollarSign } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { JobApplication } from '@/types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ApplicationForm {
  applicantName: string;
  email: string;
  phone: string;
  coverLetter: string;
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const job = jobs.find(j => j.id === id);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationForm>();

  const onSubmit = (data: ApplicationForm) => {
    const application: Partial<JobApplication> = {
      ...data,
      jobId: id!,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    console.log('Application submitted:', application);
    toast.success("Votre candidature a été envoyée avec succès");
    setIsDialogOpen(false);
    reset();
  };

  if (!job) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Offre non trouvée</h1>
        <Button onClick={() => navigate('/emplois')}>Retour aux offres</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/emplois')}
        className="mb-6"
      >
        ← Retour aux offres
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeDollarSign className="h-4 w-4" /> {job.salary.amount} {job.salary.currency}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg">
                {job.contract === 'full_time' ? 'Temps plein' :
                 job.contract === 'part_time' ? 'Temps partiel' : 'Contrat'}
              </Badge>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Description du poste</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Exigences</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
              </section>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Détails de l'offre</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>{job.positions} poste{job.positions > 1 ? 's' : ''} disponible{job.positions > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Publié le {new Date(job.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>Date limite: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-6">Postuler maintenant</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Postuler pour: {job.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    <Input
                      {...register('applicantName', { required: true })}
                      className={errors.applicantName ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      {...register('phone', { required: true })}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
                    <Textarea
                      {...register('coverLetter', { required: true })}
                      className={errors.coverLetter ? 'border-red-500' : ''}
                      rows={5}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Envoyer ma candidature
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
