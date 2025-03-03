
import React from 'react';
import { formatDate } from "../utils/formatUtils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, MoreHorizontal, Check, Clock, X, MapPin, Phone, Eye } from 'lucide-react';
import { JobApplication, Job } from '@/types/job';

interface ApplicationsTableProps {
  applications: {application: JobApplication, job: Job}[];
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onSelectApplication: (application: JobApplication) => void;
  isLoading: boolean;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  updateApplicationStatus,
  onSelectApplication,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
        </div>
        <p className="mt-2 text-gray-500">Chargement des candidatures...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <div className="mb-4 text-gray-400">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune candidature trouvée</h3>
        <p className="text-gray-500">Il n'y a pas de candidatures correspondant à vos critères.</p>
      </div>
    );
  }

  // Affichage pour mobile
  const renderMobileView = () => (
    <div className="space-y-4 lg:hidden">
      {applications.map((item) => (
        <div key={item.application.id} className="bg-white rounded-lg shadow overflow-hidden border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{item.application.applicantName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{item.application.applicantName}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[180px]">{item.application.email}</div>
                </div>
              </div>
              <Badge
                className={`${
                  item.application.status === 'approved'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : item.application.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}
              >
                {item.application.status === 'approved' ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Acceptée
                  </>
                ) : item.application.status === 'pending' ? (
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
          <div className="p-4 border-b">
            <div className="text-sm font-medium mb-1">{item.job.title}</div>
            <div className="text-xs text-gray-500 flex items-center mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {item.job.location}
            </div>
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Phone className="h-4 w-4 mr-1 text-gray-400" />
              {item.application.phone}
            </div>
            <div className="text-xs text-gray-500">
              Postuler le {formatDate(item.application.submittedAt)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelectApplication(item.application)}
              className="text-xs h-8"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Détails
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-green-600 h-8"
                disabled={item.application.status === 'approved'}
                onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'approved')}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Accepter
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-red-600 h-8"
                disabled={item.application.status === 'rejected'}
                onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'rejected')}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Refuser
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Affichage pour desktop
  const renderDesktopView = () => (
    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Candidat</th>
              <th className="px-6 py-3">Offre</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((item) => (
              <tr key={item.application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{item.application.applicantName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.application.applicantName}</div>
                      <div className="text-sm text-gray-500">{item.application.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.job.title}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.job.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                    {item.application.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(item.application.submittedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    className={`${
                      item.application.status === 'approved'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : item.application.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {item.application.status === 'approved' ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Acceptée
                      </>
                    ) : item.application.status === 'pending' ? (
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        onClick={() => onSelectApplication(item.application)}
                      >
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'approved')}
                        disabled={item.application.status === 'approved'}
                      >
                        Accepter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'pending')}
                        disabled={item.application.status === 'pending'}
                      >
                        Mettre en attente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(item.application.id, item.job.id, 'rejected')}
                        disabled={item.application.status === 'rejected'}
                        className="text-red-600"
                      >
                        Refuser
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {renderMobileView()}
      {renderDesktopView()}
    </>
  );
};

export default ApplicationsTable;
