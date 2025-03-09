
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import useLocalStorage from '@/hooks/useLocalStorage';

interface AppearanceCardProps {
  onPreferenceChange: (key: string, value: any) => void;
}

export const AppearanceCard: React.FC<AppearanceCardProps> = ({ onPreferenceChange }) => {
  const { getItem, setItem } = useLocalStorage();
  
  const [selectedColor, setSelectedColor] = useState(() => 
    getItem('user_accent_color', 'purple')
  );
  
  const [selectedLayout, setSelectedLayout] = useState(() => 
    getItem('user_layout', 'default')
  );

  useEffect(() => {
    const applyAccentColor = () => {
      const colors: Record<string, string> = {
        'purple': '#8B5CF6',
        'blue': '#3B82F6',
        'green': '#10B981',
        'orange': '#F97316',
        'red': '#EF4444',
        'teal': '#14B8A6'
      };
      
      const colorValue = colors[selectedColor] || colors.purple;
      document.documentElement.style.setProperty('--accent-color', colorValue);
      document.documentElement.style.setProperty('--primary-color', colorValue);
      
      setItem('user_accent_color', selectedColor);
      
      document.querySelectorAll('.btn-primary').forEach(el => {
        (el as HTMLElement).style.backgroundColor = colorValue;
      });
    };
    
    applyAccentColor();
    onPreferenceChange('accentColor', selectedColor);
  }, [selectedColor, setItem, onPreferenceChange]);
  
  useEffect(() => {
    const applyLayout = () => {
      const body = document.body;
      
      body.classList.remove('layout-default', 'layout-compact');
      
      body.classList.add(`layout-${selectedLayout}`);
      
      if (selectedLayout === 'compact') {
        document.documentElement.style.setProperty('--content-spacing', '0.75rem');
        document.documentElement.style.setProperty('--card-padding', '1rem');
      } else {
        document.documentElement.style.setProperty('--content-spacing', '1.5rem');
        document.documentElement.style.setProperty('--card-padding', '1.5rem');
      }
      
      setItem('user_layout', selectedLayout);
    };
    
    applyLayout();
    onPreferenceChange('layout', selectedLayout);
  }, [selectedLayout, setItem, onPreferenceChange]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toast.success(`Thème de couleur ${color} appliqué`);
  };
  
  const handleLayoutChange = (value: string) => {
    setSelectedLayout(value);
    toast.success(`Disposition ${value === 'default' ? 'standard' : 'compacte'} appliquée`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="font-medium mb-2">Thème</div>
          <RadioGroup 
            defaultValue="light" 
            className="grid grid-cols-1 gap-4"
            value="light"
            disabled
          >
            <div>
              <RadioGroupItem 
                value="light" 
                id="theme-light" 
                className="sr-only" 
              />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-white p-4 cursor-pointer"
              >
                <span>Clair (par défaut)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="font-medium mb-2">Couleur d'accent</div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'purple', color: '#8B5CF6', label: 'Violet' },
              { name: 'blue', color: '#3B82F6', label: 'Bleu' },
              { name: 'green', color: '#10B981', label: 'Vert' },
              { name: 'orange', color: '#F97316', label: 'Orange' }, 
              { name: 'red', color: '#EF4444', label: 'Rouge' },
              { name: 'teal', color: '#14B8A6', label: 'Turquoise' }
            ].map((colorObj) => (
              <button
                key={colorObj.name}
                className={`w-10 h-10 rounded-full transition-all flex items-center justify-center transform ${
                  selectedColor === colorObj.name ? 'ring-4 ring-offset-2 ring-black scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: colorObj.color }}
                onClick={() => handleColorChange(colorObj.name)}
                aria-label={`Thème ${colorObj.label}`}
                title={colorObj.label}
              >
                {selectedColor === colorObj.name && (
                  <Check className="text-white h-5 w-5" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="font-medium mb-2">Disposition</div>
          <RadioGroup 
            value={selectedLayout}
            onValueChange={handleLayoutChange}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem 
                value="default" 
                id="layout-default" 
                className="sr-only" 
              />
              <Label
                htmlFor="layout-default"
                className={`flex flex-col items-center justify-between rounded-md border-2 ${
                  selectedLayout === 'default' ? 'border-primary' : 'border-muted'
                } bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer`}
              >
                <Layout className="mb-2 h-6 w-6" />
                <span>Standard</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem 
                value="compact" 
                id="layout-compact" 
                className="sr-only" 
              />
              <Label
                htmlFor="layout-compact"
                className={`flex flex-col items-center justify-between rounded-md border-2 ${
                  selectedLayout === 'compact' ? 'border-primary' : 'border-muted'
                } bg-white p-4 hover:bg-gray-100 hover:border-gray-200 cursor-pointer`}
              >
                <Layout className="mb-2 h-6 w-6" />
                <span>Compact</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
