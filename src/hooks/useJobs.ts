
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { toast } from "sonner";

// Mock database
let MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Agent de sécurité résidentiel",
    domain: "residential_security",
    description: "Surveillance de propriétés privées et contrôle d'accès",
    requirements: "- Carte professionnelle obligatoire\n- Expérience minimum de 2 ans",
    contract: "full_time",
    location: "Paris",
    salary: {
      amount: 2000,
      currency: "EUR"
    },
    positions: 2,
    publishDate: "2024-02-10",
    deadline: "2024-03-10",
    status: "active"
  }
];

export const useJobs = () => {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => MOCK_JOBS,
  });

  const addJob = useMutation({
    mutationFn: async (newJob: Omit<Job, "id">) => {
      const job = {
        ...newJob,
        id: Math.random().toString(36).substr(2, 9),
      };
      MOCK_JOBS = [...MOCK_JOBS, job];
      return job;
    },
    onSuccess: (newJob) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) => [...old, newJob]);
      toast.success("Offre d'emploi ajoutée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'offre d'emploi");
    },
  });

  const updateJob = useMutation({
    mutationFn: async (updatedJob: Job) => {
      MOCK_JOBS = MOCK_JOBS.map((job) =>
        job.id === updatedJob.id ? updatedJob : job
      );
      return updatedJob;
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) =>
        old.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      toast.success("Offre d'emploi mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'offre d'emploi");
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (jobId: string) => {
      MOCK_JOBS = MOCK_JOBS.filter((job) => job.id !== jobId);
      return jobId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["jobs"], (old: Job[] = []) =>
        old.filter((job) => job.id !== deletedId)
      );
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
