
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { toast } from "sonner";
import useLocalStorage from "./useLocalStorage";

// Données mock pour les offres d'emploi
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Agent de sécurité pour résidences de luxe",
    domain: "residential_security",
    description: "Nous recherchons un agent de sécurité professionnel pour assurer la protection de résidences de luxe dans le quartier du 16ème arrondissement de Paris. Vous serez chargé de la surveillance, du contrôle d'accès et de la prévention des incidents.",
    requirements: "- Carte professionnelle à jour\n- Expérience minimale de 2 ans\n- Excellente présentation\n- Discrétion et professionnalisme\n- Disponibilité pour travailler en horaires décalés",
    contract: "full_time",
    location: "Paris",
    salary: {
      amount: 2200,
      currency: "EUR"
    },
    positions: 2,
    publishDate: "2024-05-01",
    deadline: "2024-06-15",
    status: "active"
  },
  {
    id: "2",
    title: "Garde du corps pour personnalités",
    domain: "bodyguard",
    description: "Agence de sécurité recherche un garde du corps expérimenté pour la protection rapprochée de personnalités publiques. Missions occasionnelles avec possibilité de déplacements internationaux.",
    requirements: "- Certificat de qualification professionnelle obligatoire\n- Expérience minimale de 5 ans\n- Formation aux premiers secours\n- Excellente condition physique\n- Maîtrise de l'anglais souhaitée",
    contract: "contract",
    location: "Lyon",
    salary: {
      amount: 3500,
      currency: "EUR"
    },
    positions: 1,
    publishDate: "2024-05-10",
    deadline: "2024-06-10",
    status: "active"
  },
  {
    id: "3",
    title: "Agent de sécurité cynophile",
    domain: "k9_security",
    description: "Entreprise spécialisée dans la sécurité recherche un agent cynophile pour la surveillance nocturne de sites industriels sensibles.",
    requirements: "- Carte professionnelle valide\n- Certificat de conducteur de chien obligatoire\n- Expérience avec chien de travail\n- Permis B obligatoire\n- Autonomie et sens des responsabilités",
    contract: "part_time",
    location: "Marseille",
    salary: {
      amount: 1800,
      currency: "EUR"
    },
    positions: 3,
    publishDate: "2024-04-20",
    deadline: "2024-05-25",
    status: "active"
  },
  {
    id: "4",
    title: "Responsable de la sécurité événementielle",
    domain: "event_security",
    description: "Entreprise organisatrice d'événements recherche un responsable de sécurité pour gérer les équipes et les dispositifs lors de grands événements culturels et sportifs.",
    requirements: "- Expérience significative en gestion d'équipe\n- Connaissance approfondie des réglementations\n- Capacité à élaborer des plans de sécurité\n- Gestion du stress et réactivité\n- Disponibilité weekends et jours fériés",
    contract: "full_time",
    location: "Lille",
    salary: {
      amount: 2800,
      currency: "EUR"
    },
    positions: 1,
    publishDate: "2024-05-05",
    deadline: "2024-07-01",
    status: "active"
  },
  {
    id: "5",
    title: "Formateur en sécurité privée",
    domain: "security_trainer",
    description: "Centre de formation recherche un formateur pour dispenser des cours théoriques et pratiques aux futurs agents de sécurité privée.",
    requirements: "- Expérience d'au moins 5 ans dans la sécurité\n- Certificat SST à jour\n- Excellentes capacités pédagogiques\n- Maîtrise des outils informatiques\n- Disponibilité en semaine",
    contract: "part_time",
    location: "Toulouse",
    salary: {
      amount: 2500,
      currency: "EUR"
    },
    positions: 2,
    publishDate: "2024-04-15",
    deadline: "2024-05-30",
    status: "closed"
  }
];

export const useJobs = () => {
  const { loadData, saveData } = useLocalStorage();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => loadData('jobs', MOCK_JOBS),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const addJob = useMutation({
    mutationFn: async (newJob: Omit<Job, "id">) => {
      const currentJobs = loadData('jobs', MOCK_JOBS);
      const job = {
        ...newJob,
        id: Math.random().toString(36).substr(2, 9),
      };
      currentJobs.push(job);
      saveData('jobs', currentJobs);
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
      const currentJobs = loadData('jobs', MOCK_JOBS);
      const updatedJobs = currentJobs.map(job =>
        job.id === updatedJob.id ? updatedJob : job
      );
      saveData('jobs', updatedJobs);
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
      const currentJobs = loadData('jobs', MOCK_JOBS);
      const updatedJobs = currentJobs.filter(job => job.id !== jobId);
      saveData('jobs', updatedJobs);
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
