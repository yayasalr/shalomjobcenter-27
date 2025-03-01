
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminJobsContent } from './jobs/components/AdminJobsContent';

const AdminJobs = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminTopbar />
          <AdminJobsContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminJobs;
