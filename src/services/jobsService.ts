
import { MOCK_JOBS } from "@/data/mockJobs";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Job, ApplicationStatus } from "@/types/job";
import { JobApplicationFormData } from "@/types/jobApplications";
import { processStoredImages, saveJobImages } from "@/hooks/useJobs/jobImageUtils";

// Service pour les opérations sur les offres d'emploi
export const useJobsService = () => {
  const { loadData, saveData } = useLocalStorage();

  // Chargement des jobs depuis le localStorage ou les données mock
  const loadJobs = (): Job[] => {
    const jobs = loadData('jobs', MOCK_JOBS);
    
    // Traiter les images pour chaque job
    const processedJobs = jobs.map(job => {
      // S'assurer que toutes les propriétés nécessaires sont définies
      if (!job.status) job.status = "active";
      if (!job.publishDate) job.publishDate = new Date().toISOString().split('T')[0];
      
      return processStoredImages(job);
    });
    
    console.log("Jobs chargés avec images traitées:", processedJobs);
    return processedJobs;
  };

  // Ajouter un nouveau job
  const createJob = async (newJob: Omit<Job, "id"> & { id: string }): Promise<Job> => {
    try {
      const currentJobs = loadData('jobs', MOCK_JOBS);
      
      // Vérifier que les propriétés obligatoires sont présentes
      if (!newJob.status) newJob.status = "active";
      if (!newJob.publishDate) newJob.publishDate = new Date().toISOString().split('T')[0];
      
      // Sauvegarder séparément les images, uniquement avec leur propre ID
      if (newJob.images && newJob.images.length > 0) {
        saveJobImages(newJob.id, newJob.images);
        console.log(`Images sauvegardées pour le job ${newJob.id}:`, newJob.images);
        
        // Nettoyer les images "latest" pour éviter les mélanges
        localStorage.removeItem('job_images_latest');
        localStorage.removeItem('job_featured_image_latest');
      }
      
      if (newJob.image) {
        // Sauvegarder l'image principale séparément avec l'ID spécifique
        localStorage.setItem(`job_featured_image_${newJob.id}`, newJob.image);
        console.log(`Image principale sauvegardée pour le job ${newJob.id}:`, newJob.image);
        
        // Nettoyer l'image "latest" 
        localStorage.removeItem('job_featured_image_latest');
      } else if (newJob.images && newJob.images.length > 0) {
        // Utiliser la première image comme image principale si non définie
        newJob.image = newJob.images[0];
        localStorage.setItem(`job_featured_image_${newJob.id}`, newJob.image);
      }
      
      // Ajouter le nouveau job
      currentJobs.push(newJob as Job);
      
      // Sauvegarder dans localStorage
      saveData('jobs', currentJobs);
      console.log("Jobs après ajout:", currentJobs);
      
      return newJob as Job;
    } catch (error) {
      console.error("Erreur lors de la création du job:", error);
      throw error;
    }
  };

  // Mettre à jour un job
  const updateJobItem = async (updatedJob: Job): Promise<Job> => {
    console.log("Mise à jour du job dans le service:", updatedJob);
    try {
      const currentJobs = loadData('jobs', MOCK_JOBS);
      
      // Trouver l'index du job à mettre à jour
      const jobIndex = currentJobs.findIndex(job => job.id === updatedJob.id);
      
      if (jobIndex === -1) {
        console.error("Job non trouvé pour la mise à jour:", updatedJob.id);
        throw new Error("Job not found");
      }
      
      // Sauvegarder séparément les images avec leur propre ID
      if (updatedJob.images && updatedJob.images.length > 0) {
        saveJobImages(updatedJob.id, updatedJob.images);
        console.log(`Images mises à jour pour le job ${updatedJob.id}:`, updatedJob.images);
      }
      
      if (updatedJob.image) {
        // Sauvegarder l'image principale séparément
        localStorage.setItem(`job_featured_image_${updatedJob.id}`, updatedJob.image);
        console.log(`Image principale mise à jour pour le job ${updatedJob.id}:`, updatedJob.image);
      }
      
      // Mettre à jour le job à l'index trouvé
      currentJobs[jobIndex] = updatedJob;
      
      // Sauvegarder les jobs mis à jour dans localStorage
      saveData('jobs', currentJobs);
      console.log("Jobs après mise à jour:", currentJobs);
      
      return updatedJob;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du job:", error);
      throw error;
    }
  };

  // Supprimer un job
  const deleteJobItem = async (jobId: string): Promise<string> => {
    try {
      const currentJobs = loadData('jobs', MOCK_JOBS);
      const updatedJobs = currentJobs.filter(job => job.id !== jobId);
      
      // Supprimer également les images associées
      localStorage.removeItem(`job_images_${jobId}`);
      localStorage.removeItem(`job_featured_image_${jobId}`);
      
      saveData('jobs', updatedJobs);
      console.log("Jobs après suppression:", updatedJobs);
      return jobId;
    } catch (error) {
      console.error("Erreur lors de la suppression du job:", error);
      throw error;
    }
  };

  // Soumettre une candidature
  const submitApplication = async (applicationData: JobApplicationFormData): Promise<any> => {
    console.log("Soumission de candidature:", applicationData);
    try {
      const currentJobs = loadData('jobs', MOCK_JOBS);
      const jobIndex = currentJobs.findIndex(job => job.id === applicationData.jobId);
      
      if (jobIndex === -1) {
        console.error("Job non trouvé:", applicationData.jobId);
        throw new Error("Offre d'emploi introuvable");
      }
      
      // Création d'un nouvel objet d'application avec le type approprié pour status
      const newApplication = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: applicationData.jobId,
        applicantName: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        coverLetter: applicationData.coverLetter,
        status: "pending" as ApplicationStatus,
        submittedAt: new Date().toISOString()
      };
      
      // Ajout de l'application à l'offre d'emploi
      if (!currentJobs[jobIndex].applications) {
        currentJobs[jobIndex].applications = [];
      }
      
      currentJobs[jobIndex].applications!.push(newApplication);
      saveData('jobs', currentJobs);
      console.log("Candidature enregistrée, jobs mis à jour:", currentJobs);
      
      return newApplication;
    } catch (error) {
      console.error("Erreur lors de la soumission de candidature:", error);
      throw error;
    }
  };

  return {
    loadJobs,
    createJob,
    updateJobItem,
    deleteJobItem,
    submitApplication
  };
};
