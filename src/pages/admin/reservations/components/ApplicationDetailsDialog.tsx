
import React from 'react';
import { JobApplication } from '@/types/job';
import { formatDate } from "../utils/formatUtils";
import { getJobForApplication } from "../utils/filterUtils";
import { Job } from '@/types/job';
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, X, Mail, Phone, FileText, Clock } from 'lucide-react';

interface ApplicationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: JobApplication | null;
  jobs: Job[];
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedApplication,
  jobs,
  updateApplicationStatus
}) => {
  if (!selectedApplication) return null;

  const job = getJobForApplication(jobs, selectedApplication.jobId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la candidature</DialogTitle>
          <DialogDescription>
            Candidature #{selectedApplication.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Offre</h3>
              <div className="text-sm">
                {job && (
                  <>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-gray-500">{job.location}</div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Candidat</h3>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{selectedApplication.applicantName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{selectedApplication.applicantName}</div>
                  <div className="text-gray-500">{selectedApplication.email}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Contact</h3>
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{selectedApplication.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{selectedApplication.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Détails</h3>
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Candidature envoyée le {formatDate(selectedApplication.submittedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Badge
                    className={`${
                      selectedApplication.status === 'approved'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : selectedApplication.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {selectedApplication.status === 'approved' ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Acceptée
                      </>
                    ) : selectedApplication.status === 'pending' ? (
                      <>
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        En attente
                      </>
                    ) : (
                      <>
                        <X className="mr-1 h-3.5 w-3.5" />
                        Refusée
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {selectedApplication.resume && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">CV</h3>
                <div className="text-sm">
                  <Link 
                    to={selectedApplication.resume} 
                    target="_blank" 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir le CV
                  </Link>
                </div>
              </div>
            </>
          )}
          
          {selectedApplication.coverLetter && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">Lettre de motivation</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md">{selectedApplication.coverLetter}</div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
            
            <div className="space-x-2">
              {selectedApplication.status !== 'approved' && job && (
                <Button
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, selectedApplication.jobId, 'approved');
                    onOpenChange(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accepter
                </Button>
              )}
              
              {selectedApplication.status !== 'rejected' && job && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    updateApplicationStatus(selectedApplication.id, selectedApplication.jobId, 'rejected');
                    onOpenChange(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Refuser
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
