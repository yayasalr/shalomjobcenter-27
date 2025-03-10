
import React from 'react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileEdit, Trash, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobActionsDropdownProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobActionsDropdown: React.FC<JobActionsDropdownProps> = ({ 
  job, 
  onEdit, 
  onDelete 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(job)}>
          <FileEdit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        {job.status === 'active' ? (
          <DropdownMenuItem onClick={() => {
            const updatedJob: Job = { ...job, status: 'closed' };
            onEdit(updatedJob);
          }}>
            <X className="mr-2 h-4 w-4" />
            Clôturer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => {
            const updatedJob: Job = { ...job, status: 'active' };
            onEdit(updatedJob);
          }}>
            <Check className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(job.id)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
