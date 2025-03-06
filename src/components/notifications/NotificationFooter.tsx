
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Clock, Rss, Bookmark, Download } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NotificationFooter = () => {
  const handleExport = (format: string) => {
    toast.success(`Notifications exportées au format ${format}`);
  };

  return (
    <div className="border-t flex flex-wrap justify-between pt-4 sm:pt-6 gap-2">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex-grow sm:flex-grow-0" asChild>
                <a href="/profile?tab=preferences">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">Gérer mes préférences</span>
                  <span className="xs:hidden">Préférences</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Gérer mes préférences de notification
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-grow sm:flex-grow-0" asChild>
                <a href="/profile?tab=notifications">
                  <Rss className="mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">S'abonner aux alertes</span>
                  <span className="xs:hidden">Alertes</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              S'abonner aux alertes et notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-grow sm:flex-grow-0" asChild>
                <a href="/profile?tab=saved">
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">Notifications sauvegardées</span>
                  <span className="xs:hidden">Sauvegardées</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Voir vos notifications sauvegardées
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-grow-0">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Exporter</span>
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-grow sm:flex-grow-0">
                <Clock className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Historique complet</span>
                <span className="xs:hidden">Historique</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Voir l'historique complet de vos notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NotificationFooter;
