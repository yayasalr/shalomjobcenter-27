import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { Navbar } from '@/components/Navbar';
import { CheckCircle, Clock, CalendarDays, MapPin, Briefcase, Building, ChevronLeft, Share2, Euro, Mail, Send, User, Phone, FileText, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SocialBar } from '@/components/social/SocialBar';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, isLoading, applyForJob } = useJobs();
  const { settings } = useSiteSettings();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applicantData, setApplicantData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: '',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const job = jobs.find(job => job.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Offre introuvable</h1>
            <p className="text-gray-500 mb-8">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
            <Link to="/emplois">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retourner aux offres
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const translateDomain = (domain: string) => {
    const domains: {[key: string]: string} = {
      'residential_security': 'Sécurité résidentielle',
      'bodyguard': 'Garde du corps',
      'private_property': 'Propriétés privées',
      'industrial_security': 'Sécurité industrielle',
      'office_security': 'Sécurité de bureau',
      'event_security': 'Sécurité événementielle',
      'k9_security': 'Maître-chien',
      'housing_offer': 'Offre de logement'
    };
    
    return domains[domain] || domain;
  };
  
  const translateContract = (contract: string) => {
    const contracts: {[key: string]: string} = {
      'full_time': 'CDI',
      'part_time': 'Temps partiel',
      'contract': 'CDD'
    };
    
    return contracts[contract] || contract;
  };
  
  const formatPriceFCFA = (priceEUR: number): string => {
    const priceFCFA = Math.round(priceEUR * 655.957);
    return priceFCFA.toLocaleString('fr-FR');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicantData.name || !applicantData.email || !applicantData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    
    try {
      await applyForJob.mutateAsync({
        jobId: job.id,
        ...applicantData
      });
      
      setIsApplyDialogOpen(false);
      toast.success("Votre candidature a été envoyée avec succès!");
      
      setApplicantData({
        name: '',
        email: '',
        phone: '',
        resume: '',
        coverLetter: '',
      });
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre candidature.");
      console.error("Erreur de candidature:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Découvrez cette offre: ${job.title} à ${job.location}`,
        url: window.location.href
      })
      .then(() => console.log('Partage réussi'))
      .catch((error) => console.error('Erreur de partage:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier!");
    }
  };

  const getDomainImage = (domain: string) => {
    switch(domain) {
      case 'residential_security':
        return 'https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?q=80&w=786&auto=format&fit=crop';
      case 'bodyguard':
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=774&auto=format&fit=crop';
      case 'private_property':
        return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop';
      case 'industrial_security':
        return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop';
      case 'housing_offer':
        return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=2070&auto=format&fit=crop';
    }
  };

  const shareUrl = `${window.location.origin}/emploi/${job?.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="hover:bg-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour aux offres
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative h-56 sm:h-72 md:h-96 bg-gray-200 overflow-hidden">
                  <img 
                    src={job.images?.[0] || getDomainImage(job.domain)} 
                    alt={job.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <Badge className="bg-sholom-primary text-white border-none">
                        {job.isHousingOffer ? 'Logement' : translateDomain(job.domain)}
                      </Badge>
                      {job.status === 'active' ? (
                        <Badge className="ml-2 bg-green-500 text-white border-none">
                          Disponible
                        </Badge>
                      ) : (
                        <Badge className="ml-2 bg-red-500 text-white border-none">
                          Clôturée
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center text-white/80">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pt-4">
                  <SocialBar 
                    type="job" 
                    itemId={job.id} 
                    title={job.title}
                    url={shareUrl}
                  />
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                      <div className="bg-sholom-primary/10 p-2 rounded-full mr-3">
                        {job.isHousingOffer ? (
                          <Home className="h-5 w-5 text-sholom-primary" />
                        ) : (
                          <Briefcase className="h-5 w-5 text-sholom-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">
                          {job.isHousingOffer ? 'Logement' : translateContract(job.contract)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                      <div className="bg-sholom-primary/10 p-2 rounded-full mr-3">
                        <CalendarDays className="h-5 w-5 text-sholom-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Publiée le</p>
                        <p className="font-medium">
                          {new Date(job.publishDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                      <div className="bg-sholom-primary/10 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-sholom-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date limite</p>
                        <p className="font-medium">
                          {new Date(job.deadline).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8 bg-sholom-primary/5 rounded-lg p-4 border border-sholom-primary/20">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sholom-dark">
                        {job.isHousingOffer ? 'Prix du logement' : 'Rémunération'}
                      </h3>
                      <div className="text-xl font-bold text-sholom-primary">
                        {job.isHousingOffer ? (
                          <>{formatPriceFCFA(job.price || 0)} FCFA<span className="text-sm font-normal text-gray-500 ml-1">/ mois</span></>
                        ) : (
                          <>{formatPriceFCFA(job.salary.amount)} FCFA<span className="text-sm font-normal text-gray-500 ml-1">/ mois</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-sholom-dark">Description</h3>
                    <div className="text-gray-700 space-y-4 prose max-w-none">
                      {job.description.split('\n').map((paragraph, index) => (
                        paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-sholom-dark">
                      {job.isHousingOffer ? 'Caractéristiques' : 'Exigences'}
                    </h3>
                    <div className="text-gray-700 space-y-4">
                      {job.isHousingOffer ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {job.bedrooms && (
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-sholom-primary mr-2" />
                              <span>{job.bedrooms} chambre{job.bedrooms > 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {job.bathrooms && (
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-sholom-primary mr-2" />
                              <span>{job.bathrooms} salle{job.bathrooms > 1 ? 's' : ''} de bain</span>
                            </div>
                          )}
                          {job.requirements.split('\n').map((req, index) => (
                            req && (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-sholom-primary mr-2 mt-0.5" />
                                <span>{req}</span>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {job.requirements.split('\n').map((req, index) => (
                            req && (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-sholom-primary mr-2 mt-0.5" />
                                <span>{req}</span>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {job.isHousingOffer && job.images && job.images.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-sholom-dark">Galerie</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {job.images.map((img, index) => (
                          <div key={index} className="rounded-lg overflow-hidden aspect-square">
                            <img 
                              src={img || getDomainImage(job.domain)} 
                              alt={`${job.title} - Image ${index + 1}`} 
                              className="w-full h-full object-cover hover-scale transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button 
                      className="bg-sholom-primary hover:bg-sholom-primary/90 text-white"
                      onClick={() => setIsApplyDialogOpen(true)}
                      disabled={job.status !== 'active'}
                    >
                      {job.isHousingOffer ? (
                        <>
                          <Building className="mr-2 h-5 w-5" />
                          Réserver ce logement
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Postuler maintenant
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="mr-2 h-5 w-5" />
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 rounded-full p-3 mr-3">
                    <Building className="h-6 w-6 text-sholom-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sholom-dark">{settings.siteName}</h3>
                    <p className="text-sm text-gray-500">{settings.footer.contact}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{settings.companyInfo?.address || "Lomé, Togo"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{settings.companyInfo?.email || "contact@sholom.com"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{settings.companyInfo?.phone || "+228 00 00 00 00"}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir le profil
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-sholom-dark mb-4">Offres similaires</h3>
                <div className="space-y-4">
                  {jobs
                    .filter(j => j.id !== job.id && j.domain === job.domain)
                    .slice(0, 3)
                    .map(similarJob => (
                      <Link 
                        key={similarJob.id} 
                        to={`/emploi/${similarJob.id}`}
                        className="block group"
                      >
                        <motion.div 
                          className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          whileHover={{ y: -2 }}
                        >
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={similarJob.images?.[0] || getDomainImage(similarJob.domain)} 
                              alt={similarJob.title} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-sholom-dark group-hover:text-sholom-primary transition-colors">
                              {similarJob.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{similarJob.location}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-sholom-primary transition-colors transform group-hover:translate-x-1" />
                        </motion.div>
                      </Link>
                    ))}
                  
                  {jobs.filter(j => j.id !== job.id && j.domain === job.domain).length === 0 && (
                    <p className="text-sm text-gray-500">Aucune offre similaire disponible.</p>
                  )}
                </div>
                
                <Link to="/emplois">
                  <Button variant="link" className="mt-2 w-full text-sholom-primary">
                    Voir toutes les offres
                  </Button>
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-sholom-primary to-sholom-secondary rounded-xl shadow-sm p-6 text-white">
                <h3 className="font-bold text-xl mb-2">
                  {job.isHousingOffer ? "Réservez ce logement" : "Postulez maintenant"}
                </h3>
                <p className="text-white/80 mb-4">
                  {job.isHousingOffer 
                    ? "Ne manquez pas cette opportunité de logement exceptionnelle à Lomé." 
                    : "Ne manquez pas cette opportunité de carrière dans le domaine de la sécurité."}
                </p>
                <Button 
                  className="w-full bg-white text-sholom-primary hover:bg-white/90"
                  onClick={() => setIsApplyDialogOpen(true)}
                  disabled={job.status !== 'active'}
                >
                  {job.isHousingOffer ? "Réserver maintenant" : "Envoyer ma candidature"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {job.isHousingOffer ? "Réserver ce logement" : "Postuler à cette offre"}
            </DialogTitle>
            <DialogDescription>
              {job.isHousingOffer 
                ? "Remplissez le formulaire ci-dessous pour réserver ce logement." 
                : "Remplissez le formulaire ci-dessous pour envoyer votre candidature."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="name" 
                  placeholder="Votre nom complet" 
                  className="pl-10"
                  value={applicantData.name}
                  onChange={(e) => setApplicantData({...applicantData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="email" 
                  type="email"
                  placeholder="votre@email.com" 
                  className="pl-10"
                  value={applicantData.email}
                  onChange={(e) => setApplicantData({...applicantData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="phone" 
                  placeholder="+228 XX XX XX XX" 
                  className="pl-10"
                  value={applicantData.phone}
                  onChange={(e) => setApplicantData({...applicantData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
            
            {!job.isHousingOffer && (
              <div>
                <label htmlFor="resume" className="block text-sm font-medium mb-1">
                  CV (lien)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="resume" 
                    placeholder="Lien vers votre CV (Google Drive, Dropbox...)" 
                    className="pl-10"
                    value={applicantData.resume}
                    onChange={(e) => setApplicantData({...applicantData, resume: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
                {job.isHousingOffer ? "Message (facultatif)" : "Lettre de motivation (facultatif)"}
              </label>
              <Textarea 
                id="coverLetter" 
                placeholder={job.isHousingOffer 
                  ? "Partagez avec nous vos besoins ou questions concernant ce logement..." 
                  : "Partagez avec nous vos motivations pour ce poste..."
                }
                className="min-h-[100px]"
                value={applicantData.coverLetter}
                onChange={(e) => setApplicantData({...applicantData, coverLetter: e.target.value})}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-sholom-primary hover:bg-sholom-primary/90">
                {job.isHousingOffer ? "Réserver" : "Envoyer ma candidature"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;
