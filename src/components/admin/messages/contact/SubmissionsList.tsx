
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { ContactFormSubmission } from '@/types/contact';
import { format } from 'date-fns';

interface SubmissionsListProps {
  filteredSubmissions: ContactFormSubmission[];
  selectedSubmission: ContactFormSubmission | null;
  searchQuery: string;
  filter: 'all' | 'new';
  newSubmissionsCount: number;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'new') => void;
  handleSelectSubmission: (submission: ContactFormSubmission) => void;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
  filteredSubmissions,
  selectedSubmission,
  searchQuery,
  filter,
  newSubmissionsCount,
  setSearchQuery,
  setFilter,
  handleSelectSubmission
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-9" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant={filter === 'new' ? "default" : "outline"} 
            size="icon"
            onClick={() => setFilter(filter === 'new' ? 'all' : 'new')}
            className="h-10 w-10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {filteredSubmissions.length} message(s) {filter === 'new' ? 'non lu(s)' : ''} - {newSubmissionsCount} nouveaux
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-400px)]">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <SubmissionListItem 
              key={submission.id}
              submission={submission}
              isSelected={selectedSubmission?.id === submission.id}
              onSelect={() => handleSelectSubmission(submission)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aucun message {filter === 'new' ? 'non lu' : ''} trouvé
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

interface SubmissionListItemProps {
  submission: ContactFormSubmission;
  isSelected: boolean;
  onSelect: () => void;
}

const SubmissionListItem: React.FC<SubmissionListItemProps> = ({ 
  submission, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-gray-50' : ''
      } ${submission.status === 'new' ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="font-medium truncate">{submission.name}</h3>
        <span className="text-xs text-gray-500">
          {format(new Date(submission.createdAt), 'dd/MM/yyyy')}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-1">{submission.email}</p>
      <div className="flex justify-between">
        <p className={`text-sm truncate ${
          submission.status === 'new' ? 'font-medium' : 'text-gray-500'
        }`}>
          {submission.subject}
        </p>
        {submission.status === 'new' && (
          <Badge variant="default" className="rounded-full">Nouveau</Badge>
        )}
        {submission.status === 'responded' && (
          <Badge variant="outline" className="bg-green-100 text-green-800">Répondu</Badge>
        )}
      </div>
    </div>
  );
};
