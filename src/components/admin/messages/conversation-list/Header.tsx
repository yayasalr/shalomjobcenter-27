
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="p-2 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button variant="ghost" size="icon">
          <Users className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
