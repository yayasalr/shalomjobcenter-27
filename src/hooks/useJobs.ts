
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { toast } from "sonner";
import { MOCK_JOBS } from "@/data/mockData";

export const useJobs = () => {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => MOCK_JOBS,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const addJob = useMutation({
    mutationFn: async (newJob: Omit<Job, "id">) => {
      const job = {
        ...newJob,
        id: Math.random().toString(36).substr(2, 9),
      };
      MOCK_JOBS.push(job);
      return job;
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

  const updateJob = useMutation({
    mutationFn: async (updatedJob: Job) => {
      const index = MOCK_JOBS.findIndex(job => job.id === updatedJob.id);
      if (index !== -1) {
        MOCK_JOBS[index] = updatedJob;
      }
      return updatedJob;
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) =>
        old.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Offre d'emploi mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'offre d'emploi");
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (jobId: string) => {
      const index = MOCK_JOBS.findIndex(job => job.id === jobId);
      if (index !== -1) {
        MOCK_JOBS.splice(index, 1);
      }
      return jobId;
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

  return {
    jobs,
    isLoading,
    error,
    addJob,
    updateJob,
    deleteJob,
  };
};
