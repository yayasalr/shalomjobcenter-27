
import React from 'react';
import { AdminStatusManager } from '@/components/admin/status/AdminStatusManager';

const AdminStatus = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Gestion des messages de statut</h1>
      <AdminStatusManager />
    </div>
  );
};

export default AdminStatus;
