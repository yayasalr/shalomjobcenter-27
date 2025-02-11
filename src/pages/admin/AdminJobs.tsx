
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useJobs } from '@/hooks/useJobs';
import { JobFormDialog } from '@/components/admin/jobs/JobFormDialog';
import { JobsTable } from '@/components/admin/jobs/JobsTable';
import { Job } from '@/types/job';

const AdminJobs = () => {
  const { jobs, isLoading, addJob, updateJob, deleteJob } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (formData: Omit<Job, "id">) => {
    try {
      await addJob.mutateAsync(formData);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditing(true);
  };

  const handleUpdate = async (formData: Omit<Job, "id">) => {
    if (selectedJob) {
      try {
        await updateJob.mutateAsync({ ...formData, id: selectedJob.id });
        setSelectedJob(null);
        setIsEditing(false);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      try {
        await deleteJob.mutateAsync(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
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
                onSave={isEditing ? handleUpdate : handleSave}
                selectedJob={selectedJob}
                isEditing={isEditing}
                onCancel={() => {
                  setSelectedJob(null);
                  setIsEditing(false);
                }}
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
                onEdit={handleEdit}
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
