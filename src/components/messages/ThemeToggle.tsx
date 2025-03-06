
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme } = useTheme();

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500">
      <Sun className="h-4 w-4" />
      <span className="sr-only">Mode clair activé</span>
    </Button>
  );
}
