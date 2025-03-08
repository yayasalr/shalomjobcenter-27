
import { MOCK_JOBS } from "@/data/mockJobs";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Job, ApplicationStatus } from "@/types/job";
import { JobApplicationFormData } from "@/types/jobApplications";
import { processStoredImages } from "@/hooks/useJobs/jobImageUtils";

// Service pour les opérations sur les offres d'emploi
export const useJobsService = () => {
  const { loadData, saveData } = useLocalStorage();

  // Chargement des jobs depuis le localStorage ou les données mock
  const loadJobs = (): Job[] => {
    const jobs = loadData('jobs', MOCK_JOBS);
    return jobs.map(job => processStoredImages(job));
  };

  // Ajouter un nouveau job
  const createJob = async (newJob: Omit<Job, "id"> & { id: string }): Promise<Job> => {
    const currentJobs = loadData('jobs', MOCK_JOBS);
    
    // Add the new job to the array
    currentJobs.push(newJob);
    
    // Save to localStorage
    saveData('jobs', currentJobs);
    console.log("Jobs after adding:", currentJobs);
    
    return newJob as Job;
  };

  // Mettre à jour un job
  const updateJobItem = async (updatedJob: Job): Promise<Job> => {
    console.log("Updating job in service:", updatedJob);
    const currentJobs = loadData('jobs', MOCK_JOBS);
    
    // Find the index of the job to update
    const jobIndex = currentJobs.findIndex(job => job.id === updatedJob.id);
    
    if (jobIndex === -1) {
      console.error("Job not found for update:", updatedJob.id);
      throw new Error("Job not found");
    }
    
    // Update the job at the found index
    currentJobs[jobIndex] = updatedJob;
    
    // Save updated jobs to localStorage
    saveData('jobs', currentJobs);
    console.log("Jobs after updating:", currentJobs);
    
    return updatedJob;
  };

  // Supprimer un job
  const deleteJobItem = async (jobId: string): Promise<string> => {
    const currentJobs = loadData('jobs', MOCK_JOBS);
    const updatedJobs = currentJobs.filter(job => job.id !== jobId);
    saveData('jobs', updatedJobs);
    console.log("Jobs after deleting:", updatedJobs);
    return jobId;
  };

  // Soumettre une candidature
  const submitApplication = async (applicationData: JobApplicationFormData): Promise<any> => {
    console.log("Submitting application:", applicationData);
    const currentJobs = loadData('jobs', MOCK_JOBS);
    const jobIndex = currentJobs.findIndex(job => job.id === applicationData.jobId);
    
    if (jobIndex === -1) {
      console.error("Job not found:", applicationData.jobId);
      throw new Error("Offre d'emploi introuvable");
    }
    
    // Création d'un nouvel objet d'application avec le type approprié pour status
    const newApplication = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: applicationData.jobId,
      applicantName: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      resume: applicationData.resume,
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
    console.log("Application saved, updated jobs:", currentJobs);
    
    return newApplication;
  };

  return {
    loadJobs,
    createJob,
    updateJobItem,
    deleteJobItem,
    submitApplication
  };
};
