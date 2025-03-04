
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import { JobApplication } from '@/types/job';

interface ApplicationActionsDropdownProps {
  application: JobApplication;
  jobId: string;
  onSelectApplication: (application: JobApplication) => void;
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
}

const ApplicationActionsDropdown: React.FC<ApplicationActionsDropdownProps> = ({
  application,
  jobId,
  onSelectApplication,
  updateApplicationStatus
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSelectApplication(application)}
        >
          Voir les détails
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateApplicationStatus(application.id, jobId, 'approved')}
          disabled={application.status === 'approved'}
        >
          Accepter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateApplicationStatus(application.id, jobId, 'pending')}
          disabled={application.status === 'pending'}
        >
          Mettre en attente
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateApplicationStatus(application.id, jobId, 'rejected')}
          disabled={application.status === 'rejected'}
          className="text-red-600"
        >
          Refuser
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApplicationActionsDropdown;
