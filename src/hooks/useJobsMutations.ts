
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useJobsService } from "@/services/jobsService";
import { Job } from "@/types/job";
import { JobApplicationFormData } from "@/types/jobApplications";
import { processStoredImages, saveJobImages } from "./useJobs/jobImageUtils";

export const useJobsMutations = () => {
  const queryClient = useQueryClient();
  const { createJob, updateJobItem, deleteJobItem, submitApplication, loadJobs } = useJobsService();

  // Mutation pour ajouter un job
  const addJob = useMutation({
    mutationFn: async (newJob: Omit<Job, "id">) => {
      try {
        const currentJobs = loadJobs();
        const id = Math.random().toString(36).substr(2, 9);
        
        const job: Job = {
          ...newJob,
          id,
          publishDate: new Date().toISOString().split('T')[0],
          status: "active",
        };
        
        // Sauvegarder les images avec le nouveau système
        if (newJob.images && newJob.images.length > 0) {
          job.images = [...newJob.images];
          saveJobImages(id, job.images);
        }
        
        // Définir l'image principale
        if (newJob.image) {
          job.image = newJob.image;
        } else if (job.images && job.images.length > 0) {
          job.image = job.images[0];
        }

        await createJob(job);
        return job;
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'offre:", error);
        throw error;
      }
    },
    onSuccess: (newJob) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) => [...old, newJob]);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Offre d'emploi ajoutée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'offre d'emploi");
    },
  });

  // Mutation pour mettre à jour un job
  const updateJob = useMutation({
    mutationFn: async (updatedJob: Job) => {
      console.log("Updating job:", updatedJob);
      return await updateJobItem(updatedJob);
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) =>
        old.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Offre d'emploi mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      toast.error("Erreur lors de la mise à jour de l'offre d'emploi");
    },
  });

  // Mutation pour supprimer un job
  const deleteJob = useMutation({
    mutationFn: async (jobId: string) => {
      return await deleteJobItem(jobId);
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) =>
        old.filter((job) => job.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Offre d'emploi supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'offre d'emploi");
    },
  });

  // Mutation pour postuler à une offre d'emploi
  const applyForJob = useMutation({
    mutationFn: async (applicationData: JobApplicationFormData) => {
      return await submitApplication(applicationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Votre candidature a été envoyée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi de votre candidature");
    },
  });

  return {
    addJob,
    updateJob,
    deleteJob,
    applyForJob
  };
};
