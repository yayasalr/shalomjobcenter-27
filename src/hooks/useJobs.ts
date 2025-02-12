
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
  },
  {
    id: "2",
    title: "Agent de sécurité événementiel",
    domain: "event_security",
    description: "Sécurisation d'événements culturels et sportifs",
    requirements: "- Carte professionnelle obligatoire\n- Expérience en gestion de foule",
    contract: "part_time",
    location: "Lyon",
    salary: {
      amount: 1800,
      currency: "EUR"
    },
    positions: 5,
    publishDate: "2024-02-12",
    deadline: "2024-03-15",
    status: "active"
  },
  {
    id: "3",
    title: "Maître-chien",
    domain: "k9_security",
    description: "Patrouille de sécurité avec chien",
    requirements: "- Carte professionnelle\n- Certification cynophile\n- Expérience avec les chiens de sécurité",
    contract: "full_time",
    location: "Marseille",
    salary: {
      amount: 2200,
      currency: "EUR"
    },
    positions: 1,
    publishDate: "2024-02-15",
    deadline: "2024-03-20",
    status: "active"
  },
  {
    id: "4",
    title: "Garde du corps",
    domain: "bodyguard",
    description: "Protection rapprochée de personnalités",
    requirements: "- Carte professionnelle\n- Formation en protection rapprochée\n- Excellente condition physique",
    contract: "contract",
    location: "Paris",
    salary: {
      amount: 3000,
      currency: "EUR"
    },
    positions: 2,
    publishDate: "2024-02-16",
    deadline: "2024-03-25",
    status: "active"
  },
  {
    id: "5",
    title: "Opérateur de systèmes de sécurité",
    domain: "security_systems",
    description: "Gestion des systèmes de vidéosurveillance et d'alarme",
    requirements: "- Formation en systèmes de sécurité\n- Maîtrise des outils informatiques",
    contract: "full_time",
    location: "Lyon",
    salary: {
      amount: 2400,
      currency: "EUR"
    },
    positions: 1,
    publishDate: "2024-02-18",
    deadline: "2024-03-30",
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
