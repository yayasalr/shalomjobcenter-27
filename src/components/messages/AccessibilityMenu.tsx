
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Accessibility, ZoomIn, Contrast, Keyboard } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

export const AccessibilityMenu = () => {
  const [open, setOpen] = useState(false);
  const { 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast,
    keyboardNavigation,
    setKeyboardNavigation
  } = useAccessibility();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500">
          <Accessibility className="h-4 w-4" />
          <span className="sr-only">Accessibilité</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Accessibilité</h4>
            <p className="text-sm text-muted-foreground">
              Paramètres d'accessibilité pour améliorer votre expérience.
            </p>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <Label htmlFor="font-size">Taille de police</Label>
              </div>
              <Slider
                id="font-size"
                defaultValue={[fontSize]}
                max={2}
                step={0.5}
                onValueChange={(values) => setFontSize(values[0])}
                className="w-[60%]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <Label htmlFor="high-contrast">Mode contraste élevé</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="keyboard-nav">Navigation clavier améliorée</Label>
              </div>
              <Switch
                id="keyboard-nav"
                checked={keyboardNavigation}
                onCheckedChange={setKeyboardNavigation}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
