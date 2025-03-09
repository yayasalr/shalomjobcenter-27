
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/language';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  // Force French language if not already set
  React.useEffect(() => {
    if (language !== 'fr') {
      setLanguage('fr');
    }
  }, [language, setLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-sholom-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
            FR
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('fr')}
          className="bg-muted"
        >
          🇫🇷 Français (uniquement)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
