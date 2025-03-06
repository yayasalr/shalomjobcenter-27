
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Clock, RSS, Bookmark, Download } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const NotificationFooter = () => {
  const handleExport = (format: string) => {
    toast.success(`Notifications exportées au format ${format}`);
  };

  return (
    <div className="border-t flex flex-wrap justify-between pt-6 gap-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <a href="/profile?tab=preferences">
            <User className="mr-2 h-4 w-4" />
            Gérer mes préférences
          </a>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <a href="/profile?tab=notifications">
            <RSS className="mr-2 h-4 w-4" />
            S'abonner aux alertes
          </a>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <a href="/profile?tab=saved">
            <Bookmark className="mr-2 h-4 w-4" />
            Notifications sauvegardées
          </a>
        </Button>
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('PDF')}>
              Format PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('CSV')}>
              Format CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('JSON')}>
              Format JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Historique complet
        </Button>
      </div>
    </div>
  );
};

export default NotificationFooter;
