
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  Bell, 
  Filter, 
  BellOff, 
  MailQuestion, 
  Calendar, 
  CreditCard,
  AlertTriangle, 
  Check 
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  filterType?: string;
  onFilterChange?: (filter: string | null) => void;
}

const NotificationHeader = ({ 
  unreadCount, 
  onMarkAllAsRead,
  filterType,
  onFilterChange 
}: NotificationHeaderProps) => {
  const [isPaused, setIsPaused] = useState(false);
  
  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    toast.success(isPaused 
      ? "Les notifications sont à nouveau actives" 
      : "Les notifications sont maintenant en pause"
    );
  };
  
  const handleFilterChange = (type: string | null) => {
    if (onFilterChange) {
      onFilterChange(type);
    } else {
      toast.info(`Filtre appliqué: ${type || 'Toutes'}`);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 mt-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Badge className="bg-primary h-6">
            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
        {isPaused && (
          <Badge variant="outline" className="text-orange-500 border-orange-500">
            En pause
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                <Check className={`h-4 w-4 mr-2 ${!filterType ? 'opacity-100' : 'opacity-0'}`} />
                Toutes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('message')}>
                <Check className={`h-4 w-4 mr-2 ${filterType === 'message' ? 'opacity-100' : 'opacity-0'}`} />
                <MailQuestion className="h-4 w-4 text-blue-500 mr-2" />
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('reservation')}>
                <Check className={`h-4 w-4 mr-2 ${filterType === 'reservation' ? 'opacity-100' : 'opacity-0'}`} />
                <Calendar className="h-4 w-4 text-green-500 mr-2" />
                Réservations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('payment')}>
                <Check className={`h-4 w-4 mr-2 ${filterType === 'payment' ? 'opacity-100' : 'opacity-0'}`} />
                <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                Paiements
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('alert')}>
                <Check className={`h-4 w-4 mr-2 ${filterType === 'alert' ? 'opacity-100' : 'opacity-0'}`} />
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                Alertes
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePauseToggle}
          className={isPaused ? "text-orange-500" : ""}
          title={isPaused ? "Activer les notifications" : "Mettre en pause les notifications"}
        >
          {isPaused ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          Tout marquer comme lu
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          asChild
        >
          <a href="/profile?tab=preferences">
            <Settings className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotificationHeader;
