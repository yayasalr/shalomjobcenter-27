
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobApplication } from '@/types/job';
import { Calendar, User, Briefcase, MapPin, Clock } from "lucide-react";

interface ApplicationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: JobApplication | null;
  jobs: any[];
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

  // Trouver le job correspondant à cette candidature
  const relatedJob = jobs.find(job => 
    job.applications?.some((app: JobApplication) => app.id === selectedApplication.id)
  );

  const jobId = relatedJob?.id || '';

  // Fonction pour formater le statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Acceptée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Refusée</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-none shadow-xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Détails de la candidature</DialogTitle>
          <DialogDescription className="text-base">
            Candidature #{selectedApplication.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Candidat</h3>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{selectedApplication.applicantName}</p>
                <p className="text-gray-600">{selectedApplication.email}</p>
                <p className="text-gray-600">{selectedApplication.phone}</p>
              </div>
            </div>
          </div>

          {relatedJob && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Offre</h3>
              <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 mt-1 text-gray-600" />
                <div>
                  <p className="font-medium">{relatedJob.title}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {relatedJob.location}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Motivation</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-800">{selectedApplication.coverLetter}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Expériences</h3>
            <div className="space-y-2">
              {selectedApplication.resume && (
                <p className="text-gray-800">{selectedApplication.resume}</p>
              )}
              {!selectedApplication.resume && (
                <p className="text-gray-500 italic">Aucune expérience mentionnée</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Informations</h3>
            <div className="space-y-2">
              {selectedApplication.submittedAt && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Postuler le: {new Date(selectedApplication.submittedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                <span>Statut: {getStatusBadge(selectedApplication.status)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button 
            variant="default" 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => {
              updateApplicationStatus(selectedApplication.id, jobId, 'approved');
              onOpenChange(false);
            }}
          >
            <span className="mr-1">✓</span> Accepter
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              updateApplicationStatus(selectedApplication.id, jobId, 'rejected');
              onOpenChange(false);
            }}
          >
            <span className="mr-1">✗</span> Refuser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
