
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/language';
import { toast } from 'sonner';
import useLocalStorage from '@/hooks/useLocalStorage';

interface LanguageRegionCardProps {
  onSavePreferences: () => void;
}

export const LanguageRegionCard: React.FC<LanguageRegionCardProps> = ({ onSavePreferences }) => {
  const { language, setLanguage } = useLanguage();
  const { setItem } = useLocalStorage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'fr';
    setLanguage(newLanguage);
    setItem('user_language', newLanguage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langue et région</CardTitle>
        <CardDescription>Définissez vos préférences linguistiques et régionales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <select 
                id="language"
                className="flex-1 border rounded-md px-3 py-2"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <select 
                id="region"
                className="flex-1 border rounded-md px-3 py-2"
                defaultValue="TG"
              >
                <option value="TG">Togo</option>
                <option value="FR">France</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSavePreferences} className="w-full md:w-auto">
          <Check className="h-4 w-4 mr-2" />
          Enregistrer les préférences
        </Button>
      </CardFooter>
    </Card>
  );
};
