
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="text-center p-12 border border-dashed rounded-lg">
      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">
        {description}
      </p>
      <Button asChild>
        <a href="/">Découvrir des logements</a>
      </Button>
    </div>
  );
};
