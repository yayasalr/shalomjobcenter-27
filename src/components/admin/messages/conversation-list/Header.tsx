
import React from 'react';
import { MoreVertical, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <UserPlus className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
