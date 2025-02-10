
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useJobs } from '@/hooks/useJobs';
import { JobFormDialog } from '@/components/admin/jobs/JobFormDialog';
import { JobsTable } from '@/components/admin/jobs/JobsTable';
import { Job } from '@/types/job';

const AdminJobs = () => {
  const { jobs, isLoading, addJob, updateJob, deleteJob } = useJobs();
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const handleSave = (formData: Omit<Job, "id">) => {
    addJob.mutate(formData);
  };

  const handleUpdate = (formData: Job) => {
    updateJob.mutate(formData);
    setSelectedJob(null);
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      deleteJob.mutate(jobId);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Gestion des offres d'emploi</h1>
              <JobFormDialog
                onSave={handleSave}
                selectedJob={selectedJob}
                isEditing={false}
                onCancel={() => setSelectedJob(null)}
              />
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <JobsTable
                jobs={jobs}
                onEdit={(job) => setSelectedJob(job)}
                onDelete={handleDelete}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminJobs;
