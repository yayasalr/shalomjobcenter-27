
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe, Check } from 'lucide-react';
import { toast } from 'sonner';
import useLocalStorage from '@/hooks/useLocalStorage';

interface LanguageRegionCardProps {
  onSavePreferences: () => void;
}

export const LanguageRegionCard: React.FC<LanguageRegionCardProps> = ({ onSavePreferences }) => {
  const { setItem } = useLocalStorage();

  const handleSavePreferences = () => {
    onSavePreferences();
    toast.success("Préférences enregistrées avec succès");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Région</CardTitle>
        <CardDescription>Définissez vos préférences régionales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
        <Button onClick={handleSavePreferences} className="w-full md:w-auto">
          <Check className="h-4 w-4 mr-2" />
          Enregistrer les préférences
        </Button>
      </CardFooter>
    </Card>
  );
};
