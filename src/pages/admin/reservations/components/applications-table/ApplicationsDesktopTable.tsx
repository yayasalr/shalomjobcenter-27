
import React from 'react';
import { formatDate } from "../../utils/formatUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone } from 'lucide-react';
import { JobApplication, Job } from '@/types/job';
import StatusBadge from './StatusBadge';
import ApplicationActionsDropdown from './ApplicationActionsDropdown';

interface ApplicationsDesktopTableProps {
  applications: {application: JobApplication, job: Job}[];
  updateApplicationStatus: (applicationId: string, jobId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onSelectApplication: (application: JobApplication) => void;
}

const ApplicationsDesktopTable: React.FC<ApplicationsDesktopTableProps> = ({
  applications,
  updateApplicationStatus,
  onSelectApplication
}) => {
  return (
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
                  <StatusBadge status={item.application.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ApplicationActionsDropdown 
                    application={item.application}
                    jobId={item.job.id}
                    onSelectApplication={onSelectApplication}
                    updateApplicationStatus={updateApplicationStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsDesktopTable;
